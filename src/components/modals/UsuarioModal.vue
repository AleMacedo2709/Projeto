<template>
  <BaseModal
    :show="show"
    :title="modalTitle"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-1">
        <label for="nome_usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nome
        </label>
        <BaseInput
          id="nome_usuario"
          v-model="form.nome_usuario"
          placeholder="Digite o nome do usuário"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="email_usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          E-mail
        </label>
        <BaseInput
          id="email_usuario"
          v-model="form.email_usuario"
          type="email"
          placeholder="Digite o e-mail do usuário"
          required
        />
      </div>

      <div class="space-y-1">
        <label for="cargo_usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Cargo
        </label>
        <BaseInput
          id="cargo_usuario"
          v-model="form.cargo_usuario"
          placeholder="Digite o cargo do usuário"
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

interface Props {
  show: boolean;
  isEditing: boolean;
  initialData?: {
    nome_usuario?: string;
    email_usuario?: string;
    cargo_usuario?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  isEditing: false,
  initialData: () => ({
    nome_usuario: '',
    email_usuario: '',
    cargo_usuario: ''
  })
});

const modalTitle = computed(() => props.isEditing ? 'Editar Usuário' : 'Adicionar Usuário');

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', data: any): void;
}>();

const form = ref({
  nome_usuario: '',
  email_usuario: '',
  cargo_usuario: ''
});

const handleSubmit = () => {
  emit('save', { ...form.value });
};

onMounted(() => {
  if (props.isEditing && props.initialData) {
    form.value = {
      nome_usuario: props.initialData.nome_usuario || '',
      email_usuario: props.initialData.email_usuario || '',
      cargo_usuario: props.initialData.cargo_usuario || ''
    };
  }
});
</script> 