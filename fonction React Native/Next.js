import { supabase } from '@/lib/supabase'

export async function fetchAnnonces() {
  const { data, error } = await supabase
    .from('annonces')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur Supabase:', error.message)
    return []
  }

  return data || []
}
