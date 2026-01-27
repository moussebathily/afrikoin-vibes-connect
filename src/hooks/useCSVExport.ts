import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useCSVExport() {
  const { toast } = useToast();

  const exportToCSV = useCallback((data: Record<string, unknown>[], filename: string, headers?: Record<string, string>) => {
    if (!data.length) {
      toast({ title: 'Aucune donnée', description: 'Aucune donnée à exporter', variant: 'destructive' });
      return;
    }

    try {
      // Get all keys from first item if headers not provided
      const keys = headers ? Object.keys(headers) : Object.keys(data[0]);
      const headerLabels = headers ? Object.values(headers) : keys;

      // Build CSV content
      const csvContent = [
        headerLabels.join(';'),
        ...data.map(row => 
          keys.map(key => {
            const value = row[key];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value).replace(/;/g, ',');
            return String(value).replace(/;/g, ',').replace(/\n/g, ' ');
          }).join(';')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ title: 'Export réussi', description: `${data.length} lignes exportées` });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({ title: 'Erreur', description: 'Impossible d\'exporter les données', variant: 'destructive' });
    }
  }, [toast]);

  return { exportToCSV };
}
