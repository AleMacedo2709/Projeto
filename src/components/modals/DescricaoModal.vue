<template>
  <BaseModal
    :show="show"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label :for="fieldMappings[entityType].name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ fieldMappings[entityType].label }}
        </label>
        <BaseInput
          :id="fieldMappings[entityType].name"
          v-model="form.name"
          :placeholder="`Digite o nome ${fieldMappings[entityType].article.toLowerCase()}`"
          required
        />
      </div>

      <div class="space-y-1">
        <label :for="fieldMappings[entityType].description" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Descrição
        </label>
        <textarea
          :id="fieldMappings[entityType].description"
          v-model="form.description"
          rows="4"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          :placeholder="`Digite a descrição ${fieldMappings[entityType].article.toLowerCase()}`"
          required
        ></textarea>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <BaseButton
          variant="secondary"
          @click="$emit('close')"
          type="button"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          variant="primary"
          type="submit"
        >
          {{ isEditing ? 'Salvar' : 'Adicionar' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseModal from '../base/BaseModal.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseInput from '../base/BaseInput.vue';

type EntityType = 'selo' | 'programa' | 'objetivo' | 'tipo_risco' | 'papel';

interface FieldMapping {
  name: string;
  description: string;
  label: string;
  article: string;
}

interface DescricaoData {
  [key: string]: string;
}

const fieldMappings: Record<EntityType, FieldMapping> = {
  selo: { name: 'nome_selo', description: 'descricao_selo', label: 'Selo', article: 'selo' },
  programa: { name: 'nome_programa', description: 'descricao_programa', label: 'Programa', article: 'programa' },
  objetivo: { name: 'nome_objetivo', description: 'descricao_objetivo', label: 'Objetivo Estratégico', article: 'objetivo' },
  tipo_risco: { name: 'nome_tipo', description: 'descricao_tipo', label: 'Tipo de Risco', article: 'risco' },
  papel: { name: 'nome_papel', description: 'descricao_papel', label: 'Papel na Equipe', article: 'papel' }
} as const;

interface Props {
  show: boolean;
  isEditing: boolean;
  initialData?: DescricaoData;
  entityType: EntityType;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  isEditing: false,
  initialData: () => ({}),
  entityType: 'selo'
});

const modalTitle = computed(() => {
  const action = props.isEditing ? 'Editar' : 'Adicionar';
  const entity = fieldMappings[props.entityType].label;
  return `${action} ${entity}`;
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: DescricaoData): void;
}>();

const form = ref<DescricaoData>({
  [fieldMappings[props.entityType].name]: '',
  [fieldMappings[props.entityType].description]: ''
});

const handleSubmit = () => {
  emit('save', { ...form.value });
};

onMounted(() => {
  if (props.isEditing && props.initialData) {
    const nameField = fieldMappings[props.entityType].name;
    const descField = fieldMappings[props.entityType].description;
    
    form.value = {
      [nameField]: props.initialData[nameField] || '',
      [descField]: props.initialData[descField] || ''
    };
  }
});
</script> 