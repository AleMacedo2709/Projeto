import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MetricasPrograma from '../MetricasPrograma.vue';
import { useIniciativasStore } from '@/stores/iniciativas';

describe('MetricasPrograma', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('exibe o estado de carregamento', () => {
    const wrapper = mount(MetricasPrograma, {
      props: {
        programaId: 1
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              iniciativas: {
                loading: true,
                iniciativas: [],
                error: null
              }
            }
          })
        ]
      }
    });

    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true);
  });

  it('exibe mensagem de erro quando há falha', () => {
    const wrapper = mount(MetricasPrograma, {
      props: {
        programaId: 1
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              iniciativas: {
                loading: false,
                iniciativas: [],
                error: 'Erro ao carregar dados'
              }
            }
          })
        ]
      }
    });

    expect(wrapper.find('[data-testid="error-message"]').text()).toBe('Erro ao carregar dados');
  });

  it('calcula e exibe métricas por programa corretamente', async () => {
    const mockIniciativas = [
      {
        id: 1,
        programa_id: 1,
        percentual_conclusao: 75,
        status_atual: 'em_andamento',
        data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: 2,
        programa_id: 1,
        percentual_conclusao: 100,
        status_atual: 'concluido',
        data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString()
      }
    ];

    const wrapper = mount(MetricasPrograma, {
      props: {
        programaId: 1
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              iniciativas: {
                loading: false,
                iniciativas: mockIniciativas,
                error: null
              }
            }
          })
        ]
      }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verifica total de iniciativas do programa
    expect(wrapper.find('[data-testid="total-iniciativas-programa"]').text()).toBe('2');

    // Verifica percentual médio de conclusão do programa
    expect(wrapper.find('[data-testid="percentual-medio-programa"]').text()).toBe('87,5%');
  });

  it('atualiza dados quando o componente é montado', async () => {
    const wrapper = mount(MetricasPrograma, {
      props: {
        programaId: 1
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    });

    const store = useIniciativasStore();
    expect(store.fetchIniciativas).toHaveBeenCalledTimes(1);
  });

  it('filtra iniciativas corretamente por programa', async () => {
    const mockIniciativas = [
      {
        id: 1,
        programa_id: 1,
        percentual_conclusao: 75,
        data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: 2,
        programa_id: 2,
        percentual_conclusao: 100,
        data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString()
      }
    ];

    const wrapper = mount(MetricasPrograma, {
      props: {
        programaId: 1
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              iniciativas: {
                loading: false,
                iniciativas: mockIniciativas,
                error: null
              }
            }
          })
        ]
      }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Verifica se apenas as iniciativas do programa 1 são consideradas
    expect(wrapper.find('[data-testid="total-iniciativas-programa"]').text()).toBe('1');
  });
});