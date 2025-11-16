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
import { categoriaService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState(null);
  const { showToast } = useToast();

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const dados = await categoriaService.listar();
      let categoriasFiltradas = dados || [];
      
      if (filtroTipo) {
        categoriasFiltradas = dados.filter(cat => cat.tipo === filtroTipo);
      }
      
      setCategorias(categoriasFiltradas);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      showToast('Erro ao carregar categorias', 'error');
      setCategorias([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar categorias quando a tela recebe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCategorias();
    });
    return unsubscribe;
  }, [navigation]);

  // Recarregar categorias quando o filtro muda
  useEffect(() => {
    if (!loading) {
      carregarCategorias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroTipo]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarCategorias();
  };

  const handleDeletar = async (id, nome) => {
    try {
      await categoriaService.deletar(id);
      showToast(`Categoria "${nome}" excluída com sucesso`, 'success');
      carregarCategorias();
    } catch (error) {
      const errorMsg = error.response?.data?.erro || 'Erro ao excluir categoria';
      showToast(errorMsg, 'error');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.categoriaCard}>
      <View style={styles.categoriaHeader}>
        <View style={styles.categoriaLeft}>
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
              size={24}
              color={item.tipo === 'receita' ? colors.receita : colors.despesa}
            />
          </View>
          <View style={styles.categoriaInfo}>
            <Text style={styles.categoriaNome}>{item.nome}</Text>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.tipo === 'receita' ? colors.receitaBg : colors.despesaBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.tipo === 'receita' ? colors.receita : colors.despesa },
                ]}
              >
                {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarCategoria', { id: Number(item.id_categoria) })}
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletar(Number(item.id_categoria), item.nome)}
          style={[styles.actionButton, styles.actionButtonDanger]}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.actionText, styles.actionTextDanger]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const receitas = categorias.filter(c => c.tipo === 'receita');
  const despesas = categorias.filter(c => c.tipo === 'despesa');

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading && !refreshing} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorias</Text>
        <Text style={styles.headerSubtitle}>
          {categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'} cadastradas
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Ionicons name="arrow-down" size={24} color={colors.receita} />
          <Text style={styles.statValue}>{receitas.length}</Text>
          <Text style={styles.statLabel}>Receitas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="arrow-up" size={24} color={colors.despesa} />
          <Text style={styles.statValue}>{despesas.length}</Text>
          <Text style={styles.statLabel}>Despesas</Text>
        </View>
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
        data={categorias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_categoria.toString()}
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
            <Ionicons name="folder-outline" size={80} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Nenhuma categoria encontrada</Text>
            <Text style={styles.emptyText}>
              {filtroTipo
                ? `Não há categorias de ${filtroTipo === 'receita' ? 'receitas' : 'despesas'} cadastradas`
                : 'Comece criando sua primeira categoria'}
            </Text>
            {!filtroTipo && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('NovaCategoria')}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Nova Categoria</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NovaCategoria')}
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
  stats: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 20,
    backgroundColor: colors.surface,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
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
  categoriaCard: {
    marginBottom: 12,
  },
  categoriaHeader: {
    marginBottom: 12,
  },
  categoriaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
