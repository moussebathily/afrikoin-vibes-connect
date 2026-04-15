-- Fix product-images storage: add DELETE and UPDATE policies scoped to seller owner
-- Sellers can only delete their own product images
CREATE POLICY "Sellers can delete own product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND owner = auth.uid()
  );

-- Sellers can only update their own product images
CREATE POLICY "Sellers can update own product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND owner = auth.uid()
  );