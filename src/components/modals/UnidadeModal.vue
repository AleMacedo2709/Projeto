<template>
  <BaseModal
    :show="show"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label for="nome_unidade" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nome da Unidade
        </label>
        <BaseInput
          id="nome_unidade"
          v-model="form.nome_unidade"
          placeholder="Digite o nome da unidade"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="sigla_unidade" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Sigla
        </label>
        <BaseInput
          id="sigla_unidade"
          v-model="form.sigla_unidade"
          placeholder="Digite a sigla da unidade"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="tipo_unidade" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tipo
        </label>
        <BaseSelect
          id="tipo_unidade"
          v-model="form.tipo_unidade"
          :options="[
            { value: 'meio', label: 'Meio' },
            { value: 'fim', label: 'Fim' }
          ]"
          placeholder="Selecione o tipo"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="ativa" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Status
        </label>
        <BaseSelect
          id="ativa"
          v-model="form.ativa"
          :options="[
            { value: true, label: 'Ativa' },
            { value: false, label: 'Inativa' }
          ]"
          placeholder="Selecione o status"
          required
        />
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
import BaseSelect from '../base/BaseSelect.vue';

interface UnidadeData {
  nome_unidade: string;
  sigla_unidade: string;
  tipo_unidade: string;
  ativa: boolean;
}

interface Props {
  show: boolean;
  isEditing: boolean;
  initialData?: UnidadeData;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  isEditing: false,
  initialData: () => ({
    nome_unidade: '',
    sigla_unidade: '',
    tipo_unidade: '',
    ativa: true
  })
});

const modalTitle = computed(() => props.isEditing ? 'Editar Unidade' : 'Adicionar Unidade');

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: UnidadeData): void;
}>();

const form = ref<UnidadeData>({
  nome_unidade: '',
  sigla_unidade: '',
  tipo_unidade: '',
  ativa: true
});

const handleSubmit = () => {
  emit('save', { ...form.value });
};

onMounted(() => {
  if (props.isEditing && props.initialData) {
    form.value = {
      nome_unidade: props.initialData.nome_unidade || '',
      sigla_unidade: props.initialData.sigla_unidade || '',
      tipo_unidade: props.initialData.tipo_unidade || '',
      ativa: props.initialData.ativa ?? true
    };
  }
});
</script> 