<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Comentários</h2>
    </div>

    <div class="p-4">
      <form @submit.prevent="enviarComentario" class="mb-6">
        <div>
          <label for="comentario" class="sr-only">Adicionar comentário</label>
          <textarea
            id="comentario"
            v-model="novoComentario"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="Adicione um comentário..."
            maxlength="500"
          ></textarea>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ novoComentario.length }}/500 caracteres
          </span>
          <button
            type="submit"
            :disabled="!novoComentario.trim() || enviando"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PaperAirplaneIcon 
              class="h-5 w-5 mr-2"
              :class="{ 'animate-spin': enviando }"
            />
            {{ enviando ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </form>

      <div class="space-y-4">
        <div v-if="carregando" class="flex justify-center py-4">
          <ArrowPathIcon class="h-8 w-8 animate-spin text-gray-400" />
        </div>

        <div v-else-if="erro" class="text-center py-4 text-red-600 dark:text-red-400">
          {{ erro }}
        </div>

        <div v-else-if="!comentarios.length" class="text-center py-4 text-gray-500 dark:text-gray-400">
          Nenhum comentário ainda.
        </div>

        <div 
          v-for="comentario in comentariosOrdenados" 
          :key="comentario.id"
          class="flex space-x-3"
        >
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UserIcon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ comentario.usuario }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatarData(comentario.data) }}
              </p>
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {{ comentario.texto }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PaperAirplaneIcon, UserIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

interface Comentario {
  id: number;
  texto: string;
  usuario: string;
  data: string;
  iniciativa_id: number;
}

const props = defineProps<{
  iniciativaId: number;
}>();

const comentarios = ref<Comentario[]>([]);
const novoComentario = ref('');
const carregando = ref(false);
const enviando = ref(false);
const erro = ref<string | null>(null);

const comentariosOrdenados = computed(() => {
  return [...comentarios.value].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );
});

const carregarComentarios = async () => {
  carregando.value = true;
  erro.value = null;

  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      comentarios.value = [
        {
          id: 1,
          texto: 'Iniciativa está progredindo bem, todos os marcos foram atingidos.',
          usuario: 'João Silva',
          data: '2024-03-20T10:30:00',
          iniciativa_id: props.iniciativaId
        },
        {
          id: 2,
          texto: 'Precisamos agendar uma reunião para discutir os próximos passos.',
          usuario: 'Maria Santos',
          data: '2024-03-19T15:45:00',
          iniciativa_id: props.iniciativaId
        }
      ];
      return;
    }

    const response = await fetch(`/api/iniciativas/${props.iniciativaId}/comentarios`);
    if (!response.ok) {
      throw new Error('Erro ao carregar comentários');
    }
    comentarios.value = await response.json();
  } catch (error) {
    erro.value = 'Erro ao carregar comentários';
    console.error(error);
  } finally {
    carregando.value = false;
  }
};

const enviarComentario = async () => {
  if (!novoComentario.value.trim() || enviando.value) return;

  enviando.value = true;
  erro.value = null;

  try {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockComentario: Comentario = {
        id: Math.max(...comentarios.value.map(c => c.id), 0) + 1,
        texto: novoComentario.value,
        usuario: 'Usuário Atual',
        data: new Date().toISOString(),
        iniciativa_id: props.iniciativaId
      };
      comentarios.value.unshift(mockComentario);
      novoComentario.value = '';
      return;
    }

    const response = await fetch(`/api/iniciativas/${props.iniciativaId}/comentarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texto: novoComentario.value
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar comentário');
    }

    const novoComentarioServidor = await response.json();
    comentarios.value.unshift(novoComentarioServidor);
    novoComentario.value = '';
  } catch (error) {
    erro.value = 'Erro ao enviar comentário';
    console.error(error);
  } finally {
    enviando.value = false;
  }
};

const formatarData = (data: string) => {
  const date = new Date(data);
  const agora = new Date();
  const diff = agora.getTime() - date.getTime();
  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 60) {
    return `${minutos} min atrás`;
  } else if (horas < 24) {
    return `${horas}h atrás`;
  } else if (dias === 1) {
    return 'Ontem';
  } else if (dias < 7) {
    return `${dias} dias atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

onMounted(() => {
  carregarComentarios();
});
</script>

 