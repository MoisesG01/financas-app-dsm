import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card } from '../components/Card';
import { transacaoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [resumo, setResumo] = useState({ receitas: 0, despesas: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarResumo = async () => {
    try {
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      const dataInicio = primeiroDia.toISOString().split('T')[0];
      const dataFim = ultimoDia.toISOString().split('T')[0];

      const dados = await transacaoService.getResumo(dataInicio, dataFim);
      setResumo({
        receitas: Number(dados.receitas || 0),
        despesas: Number(dados.despesas || 0),
        saldo: Number(dados.saldo || 0),
      });
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
      showToast('Erro ao carregar resumo financeiro', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarResumo();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    carregarResumo();
  };

  const formatarValor = (valor) => {
    return `R$ ${Number(valor || 0).toFixed(2).replace('.', ',')}`;
  };

  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header com gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.nome?.split(' ')[0] || 'Usuário'}!</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Perfil')}
            style={styles.avatarButton}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Card de Resumo */}
      <View style={styles.resumoContainer}>
        <Card variant="elevated" style={styles.resumoCard}>
          <Text style={styles.resumoTitle}>Resumo do Mês</Text>
          
          <View style={styles.resumoGrid}>
            <View style={styles.resumoItem}>
              <View style={[styles.resumoIcon, { backgroundColor: colors.receitaBg }]}>
                <Ionicons name="arrow-down" size={24} color={colors.receita} />
              </View>
              <View style={styles.resumoInfo}>
                <Text style={styles.resumoLabel}>Receitas</Text>
                <Text style={[styles.resumoValor, { color: colors.receita }]}>
                  {formatarValor(resumo.receitas)}
                </Text>
              </View>
            </View>

            <View style={styles.resumoItem}>
              <View style={[styles.resumoIcon, { backgroundColor: colors.despesaBg }]}>
                <Ionicons name="arrow-up" size={24} color={colors.despesa} />
              </View>
              <View style={styles.resumoInfo}>
                <Text style={styles.resumoLabel}>Despesas</Text>
                <Text style={[styles.resumoValor, { color: colors.despesa }]}>
                  {formatarValor(resumo.despesas)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.saldoContainer}>
            <View style={styles.saldoContent}>
              <Ionicons name="wallet" size={28} color={colors.primary} />
              <View style={styles.saldoInfo}>
                <Text style={styles.saldoLabel}>Saldo</Text>
                <Text
                  style={[
                    styles.saldoValor,
                    { color: resumo.saldo >= 0 ? colors.receita : colors.despesa },
                  ]}
                >
                  {formatarValor(resumo.saldo)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.receita }]}
            onPress={() => navigation.navigate('NovaTransacao', { tipo: 'receita' })}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={32} color="#fff" />
            <Text style={styles.actionCardText}>Nova Receita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.despesa }]}
            onPress={() => navigation.navigate('NovaTransacao', { tipo: 'despesa' })}
            activeOpacity={0.8}
          >
            <Ionicons name="remove-circle" size={32} color="#fff" />
            <Text style={styles.actionCardText}>Nova Despesa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Atalhos */}
      <View style={styles.shortcutsSection}>
        <TouchableOpacity
          style={styles.shortcutItem}
          onPress={() => navigation.navigate('Transacoes')}
          activeOpacity={0.7}
        >
          <View style={styles.shortcutIcon}>
            <Ionicons name="list" size={24} color={colors.primary} />
          </View>
          <View style={styles.shortcutContent}>
            <Text style={styles.shortcutTitle}>Ver todas as transações</Text>
            <Text style={styles.shortcutSubtitle}>Visualize seu histórico completo</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shortcutItem}
          onPress={() => navigation.navigate('Categorias')}
          activeOpacity={0.7}
        >
          <View style={styles.shortcutIcon}>
            <Ionicons name="folder" size={24} color={colors.primary} />
          </View>
          <View style={styles.shortcutContent}>
            <Text style={styles.shortcutTitle}>Gerenciar categorias</Text>
            <Text style={styles.shortcutSubtitle}>Organize suas receitas e despesas</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarButton: {
    padding: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumoContainer: {
    padding: 20,
    marginTop: -20,
  },
  resumoCard: {
    padding: 24,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  resumoGrid: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  resumoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  resumoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resumoInfo: {
    flex: 1,
  },
  resumoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resumoValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saldoContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saldoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saldoInfo: {
    marginLeft: 16,
    flex: 1,
  },
  saldoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saldoValor: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    minHeight: 120,
  },
  actionCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  shortcutsSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  shortcutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  shortcutContent: {
    flex: 1,
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  shortcutSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
