import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card } from '../components/Card';
import { transacaoService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TransacoesScreen({ navigation }) {
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const { showToast } = useToast();

  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      const filtros = filtroTipo ? { tipo: filtroTipo } : {};
      const dados = await transacaoService.listar(filtros);
      setTransacoes(dados || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      showToast('Erro ao carregar transações', 'error');
      setTransacoes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar transações quando a tela recebe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarTransacoes();
    });
    return unsubscribe;
  }, [navigation]);

  // Recarregar transações quando o filtro muda
  useEffect(() => {
    if (!loading) {
      carregarTransacoes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarTransacoes();
  };

  const handleDeletar = async (id, descricao) => {
    try {
      await transacaoService.deletar(id);
      showToast('Transação excluída com sucesso', 'success');
      carregarTransacoes();
    } catch (error) {
      showToast('Erro ao excluir transação', 'error');
    }
  };

  const formatarData = (data) => {
    try {
      const date = new Date(data);
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(ontem.getDate() - 1);

      if (date.toDateString() === hoje.toDateString()) {
        return 'Hoje';
      }
      if (date.toDateString() === ontem.toDateString()) {
        return 'Ontem';
      }

      const meses = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ];
      const dia = date.getDate();
      const mes = meses[date.getMonth()];
      return `${dia} ${mes}`;
    } catch {
      return data;
    }
  };

  const formatarValor = (valor) => {
    const numValor = parseFloat(valor) || 0;
    return `R$ ${numValor.toFixed(2).replace('.', ',')}`;
  };

  const renderItem = ({ item }) => (
    <Card style={styles.transacaoCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditarTransacao', { id: Number(item.id_transacao) })}
        activeOpacity={0.7}
      >
        <View style={styles.transacaoHeader}>
          <View style={styles.transacaoLeft}>
            <View
              style={[
                styles.tipoIcon,
                {
                  backgroundColor:
                    item.tipo === 'receita' ? colors.receitaBg : colors.despesaBg,
                },
              ]}
            >
              <Ionicons
                name={item.tipo === 'receita' ? 'arrow-down' : 'arrow-up'}
                size={20}
                color={item.tipo === 'receita' ? colors.receita : colors.despesa}
              />
            </View>
            <View style={styles.transacaoInfo}>
              <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
              <View style={styles.transacaoMeta}>
                <View style={styles.categoriaBadge}>
                  <Ionicons name="folder" size={12} color={colors.textSecondary} />
                  <Text style={styles.categoriaText}>{item.categoria_nome}</Text>
                </View>
                <Text style={styles.data}>{formatarData(item.data)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.transacaoRight}>
            <Text
              style={[
                styles.valor,
                { color: item.tipo === 'receita' ? colors.receita : colors.despesa },
              ]}
            >
              {item.tipo === 'receita' ? '+' : '-'} {formatarValor(item.valor)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarTransacao', { id: Number(item.id_transacao) })}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletar(Number(item.id_transacao), item.descricao)}
          style={[styles.actionButton, styles.actionButtonDanger]}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.actionText, styles.actionTextDanger]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading && !refreshing} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transações</Text>
        <Text style={styles.headerSubtitle}>
          {transacoes.length} {transacoes.length === 1 ? 'transação' : 'transações'}
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtros}>
        <TouchableOpacity
          style={[styles.filtroButton, filtroTipo === null && styles.filtroAtivo]}
          onPress={() => setFiltroTipo(null)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filtroText,
              filtroTipo === null && styles.filtroTextAtivo,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroButton, filtroTipo === 'receita' && styles.filtroAtivo]}
          onPress={() => setFiltroTipo('receita')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-down"
            size={16}
            color={filtroTipo === 'receita' ? '#fff' : colors.receita}
            style={styles.filtroIcon}
          />
          <Text
            style={[
              styles.filtroText,
              filtroTipo === 'receita' && styles.filtroTextAtivo,
            ]}
          >
            Receitas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filtroButton, filtroTipo === 'despesa' && styles.filtroAtivo]}
          onPress={() => setFiltroTipo('despesa')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up"
            size={16}
            color={filtroTipo === 'despesa' ? '#fff' : colors.despesa}
            style={styles.filtroIcon}
          />
          <Text
            style={[
              styles.filtroText,
              filtroTipo === 'despesa' && styles.filtroTextAtivo,
            ]}
          >
            Despesas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_transacao.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={80} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
            <Text style={styles.emptyText}>
              {filtroTipo
                ? `Não há ${filtroTipo === 'receita' ? 'receitas' : 'despesas'} cadastradas`
                : 'Comece adicionando sua primeira transação'}
            </Text>
            {!filtroTipo && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('NovaTransacao')}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Nova Transação</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovaTransacao')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filtros: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filtroButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginHorizontal: 4,
  },
  filtroAtivo: {
    backgroundColor: colors.primary,
  },
  filtroIcon: {
    marginRight: 6,
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filtroTextAtivo: {
    color: '#fff',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  transacaoCard: {
    marginBottom: 12,
  },
  transacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transacaoLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transacaoInfo: {
    flex: 1,
  },
  transacaoDescricao: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  transacaoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  categoriaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  data: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  transacaoRight: {
    alignItems: 'flex-end',
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: colors.borderLight,
  },
  actionButtonDanger: {
    backgroundColor: colors.despesaBg,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  actionTextDanger: {
    color: colors.error,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
