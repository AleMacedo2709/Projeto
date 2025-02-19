<template>
  <BaseModal
    :show="show"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label for="usuario_id" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Usuário
        </label>
        <BaseSelect
          id="usuario_id"
          v-model="form.usuario_id"
          :options="usuarios"
          placeholder="Selecione o usuário"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="nivel_acesso" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Níveis de Acesso
        </label>
        <div class="space-y-2">
          <div v-for="nivel in niveisAcesso" :key="nivel.value" class="flex items-center">
            <input
              type="checkbox"
              :id="'nivel_' + nivel.value"
              v-model="form.niveis_acesso"
              :value="nivel.value"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            <label :for="'nivel_' + nivel.value" class="ml-2 block text-sm text-gray-900 dark:text-gray-200">
              {{ nivel.label }}
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <label for="ativo" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Status
        </label>
        <BaseSelect
          id="ativo"
          v-model="form.ativo"
          :options="[
            { value: true, label: 'Ativo' },
            { value: false, label: 'Inativo' }
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
import BaseSelect from '../base/BaseSelect.vue';

interface Usuario {
  value: number;
  label: string;
}

interface GestorData {
  usuario_id: string;
  niveis_acesso: string[];
  ativo: boolean;
}

interface Props {
  show: boolean;
  isEditing: boolean;
  initialData?: GestorData;
  usuarios: Usuario[];
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  isEditing: false,
  initialData: () => ({
    usuario_id: '',
    niveis_acesso: [],
    ativo: true
  }),
  usuarios: () => []
});

const modalTitle = computed(() => props.isEditing ? 'Editar Gestor' : 'Adicionar Gestor');

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: GestorData): void;
}>();

const niveisAcesso = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gestor_cadastros', label: 'Gestor de Cadastros' },
  { value: 'gestor_selo_pgj', label: 'Gestor Selo PGJ' },
  { value: 'gestor_selo_cg', label: 'Gestor Selo CG' }
] as const;

const form = ref<GestorData>({
  usuario_id: '',
  niveis_acesso: [],
  ativo: true
});

const handleSubmit = () => {
  if (form.value.niveis_acesso.length === 0) {
    alert('Selecione pelo menos um nível de acesso');
    return;
  }
  emit('save', { ...form.value });
};

onMounted(() => {
  if (props.isEditing && props.initialData) {
    form.value = {
      usuario_id: props.initialData.usuario_id || '',
      niveis_acesso: Array.isArray(props.initialData.niveis_acesso) 
        ? props.initialData.niveis_acesso 
        : [],
      ativo: props.initialData.ativo ?? true
    };
  }
});
</script> 