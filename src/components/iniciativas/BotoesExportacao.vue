<template>
  <div class="flex space-x-4">
    <button
      @click="exportarPDF"
      :disabled="exportandoPDF"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
    >
      <DocumentArrowDownIcon 
        class="h-5 w-5 mr-2"
        :class="{ 'animate-spin': exportandoPDF }"
      />
      {{ exportandoPDF ? 'Exportando...' : 'Exportar PDF' }}
    </button>

    <button
      @click="exportarExcel"
      :disabled="exportandoExcel"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-500 dark:hover:bg-green-600"
    >
      <TableCellsIcon 
        class="h-5 w-5 mr-2"
        :class="{ 'animate-spin': exportandoExcel }"
      />
      {{ exportandoExcel ? 'Exportando...' : 'Exportar Excel' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/vue/24/outline';
import type { Iniciativa } from '../../types/iniciativas';
import { exportarParaPDF, exportarParaExcel, downloadBlob } from '../../services/exportarIniciativa';

const props = defineProps<{
  iniciativa: Iniciativa;
}>();

const exportandoPDF = ref(false);
const exportandoExcel = ref(false);

const exportarPDF = async () => {
  if (exportandoPDF.value) return;
  
  exportandoPDF.value = true;
  try {
    const blob = await exportarParaPDF(props.iniciativa);
    if (blob) {
      const filename = `iniciativa-${props.iniciativa.id}-${formatarDataArquivo(new Date())}.pdf`;
      downloadBlob(blob, filename);
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
  } finally {
    exportandoPDF.value = false;
  }
};

const exportarExcel = async () => {
  if (exportandoExcel.value) return;
  
  exportandoExcel.value = true;
  try {
    const blob = await exportarParaExcel(props.iniciativa);
    if (blob) {
      const filename = `iniciativa-${props.iniciativa.id}-${formatarDataArquivo(new Date())}.xlsx`;
      downloadBlob(blob, filename);
    }
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
  } finally {
    exportandoExcel.value = false;
  }
};

const formatarDataArquivo = (data: Date): string => {
  return data.toISOString().split('T')[0].replace(/-/g, '');
};
</script>
 