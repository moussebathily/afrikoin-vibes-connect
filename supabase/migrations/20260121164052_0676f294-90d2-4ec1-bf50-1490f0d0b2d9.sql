-- Table pour les messages de chat des courses
CREATE TABLE public.ride_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'driver')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour performance
CREATE INDEX idx_ride_messages_ride_id ON public.ride_messages(ride_id);
CREATE INDEX idx_ride_messages_created_at ON public.ride_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.ride_messages ENABLE ROW LEVEL SECURITY;

-- Policies: customers can view/send messages for their rides
CREATE POLICY "Customers can view messages for their rides"
ON public.ride_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.rides 
        WHERE rides.id = ride_messages.ride_id 
        AND rides.customer_id = auth.uid()
    )
);

CREATE POLICY "Customers can send messages for their rides"
ON public.ride_messages FOR INSERT
WITH CHECK (
    sender_type = 'customer' AND
    sender_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.rides 
        WHERE rides.id = ride_messages.ride_id 
        AND rides.customer_id = auth.uid()
        AND rides.status IN ('accepted', 'in_progress')
    )
);

-- Policies: drivers can view/send messages for their assigned rides
CREATE POLICY "Drivers can view messages for their rides"
ON public.ride_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.rides r
        JOIN public.drivers d ON r.driver_id = d.id
        WHERE r.id = ride_messages.ride_id 
        AND d.user_id = auth.uid()
    )
);

CREATE POLICY "Drivers can send messages for their rides"
ON public.ride_messages FOR INSERT
WITH CHECK (
    sender_type = 'driver' AND
    EXISTS (
        SELECT 1 FROM public.rides r
        JOIN public.drivers d ON r.driver_id = d.id
        WHERE r.id = ride_messages.ride_id 
        AND d.user_id = auth.uid()
        AND r.status IN ('accepted', 'in_progress')
    )
);

-- Allow updating read status
CREATE POLICY "Users can mark messages as read"
ON public.ride_messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.rides 
        WHERE rides.id = ride_messages.ride_id 
        AND (rides.customer_id = auth.uid() OR 
             rides.driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()))
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.rides 
        WHERE rides.id = ride_messages.ride_id 
        AND (rides.customer_id = auth.uid() OR 
             rides.driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()))
    )
);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_messages;