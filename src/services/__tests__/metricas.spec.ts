import { describe, it, expect } from 'vitest';
import { calcularMetricasUnidade, calcularMetricasPrograma, calcularTendencia } from '../metricas';
import type { Iniciativa } from '@/types/iniciativas';

describe('Serviço de Métricas', () => {
  const mockIniciativas: Iniciativa[] = [
    {
      id: 1,
      percentual_conclusao: 75,
      status_atual: 'em_andamento',
      data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString() // Data futura
    } as Iniciativa,
    {
      id: 2,
      percentual_conclusao: 100,
      status_atual: 'concluido',
      data_ultima_avaliacao: new Date(Date.now() + 86400000).toISOString() // Data futura
    } as Iniciativa
  ];

  describe('calcularMetricasUnidade', () => {
    it('calcula métricas corretamente com dados válidos', () => {
      const metricas = calcularMetricasUnidade(mockIniciativas);
      
      expect(metricas.total_iniciativas).toBe(2);
      expect(metricas.percentual_conclusao_medio).toBe(87.5);
      expect(metricas.iniciativas_atrasadas).toBe(0);
      expect(metricas.desempenho_geral).toBeGreaterThan(0);
    });

    it('retorna valores padrão para array vazio', () => {
      const metricas = calcularMetricasUnidade([]);
      
      expect(metricas.total_iniciativas).toBe(0);
      expect(metricas.percentual_conclusao_medio).toBe(0);
      expect(metricas.iniciativas_atrasadas).toBe(0);
      expect(metricas.desempenho_geral).toBe(0);
    });
  });

  describe('calcularMetricasPrograma', () => {
    it('calcula métricas do programa corretamente', () => {
      const metricas = calcularMetricasPrograma(mockIniciativas);
      
      expect(metricas.total_iniciativas).toBe(2);
      expect(metricas.percentual_conclusao_medio).toBe(87.5);
      expect(metricas.desempenho_geral).toBe(88);
    });

    it('retorna valores padrão para array vazio', () => {
      const metricas = calcularMetricasPrograma([]);
      
      expect(metricas.total_iniciativas).toBe(0);
      expect(metricas.percentual_conclusao_medio).toBe(0);
      expect(metricas.desempenho_geral).toBe(0);
    });
  });

  describe('calcularTendencia', () => {
    it('calcula tendência crescente corretamente', () => {
      const valores = [10, 20, 30, 40, 50];
      const tendencia = calcularTendencia(valores);
      
      expect(tendencia.tendencia).toBe('crescente');
      expect(tendencia.valor_atual).toBe(50);
      expect(tendencia.valor_projetado).toBeGreaterThan(50);
    });

    it('calcula tendência decrescente corretamente', () => {
      const valores = [50, 40, 30, 20, 10];
      const tendencia = calcularTendencia(valores);
      
      expect(tendencia.tendencia).toBe('decrescente');
      expect(tendencia.valor_atual).toBe(10);
      expect(tendencia.valor_projetado).toBeLessThan(10);
    });

    it('retorna tendência estável para valores constantes', () => {
      const valores = [10, 10, 10, 10, 10];
      const tendencia = calcularTendencia(valores);
      
      expect(tendencia.tendencia).toBe('estavel');
      expect(tendencia.valor_atual).toBe(10);
      expect(tendencia.valor_projetado).toBeCloseTo(10, 2);
    });

    it('lida corretamente com array de um único valor', () => {
      const valores = [10];
      const tendencia = calcularTendencia(valores);
      
      expect(tendencia.valor_atual).toBe(10);
      expect(tendencia.valor_projetado).toBe(10);
      expect(tendencia.variacao_percentual).toBe(0);
      expect(tendencia.tendencia).toBe('estavel');
    });
  });
}); 