import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PerfilScreen() {
  const { user, atualizarPerfil, logout, carregarPerfil } = useAuth();
  const { showToast } = useToast();
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSalvar = async () => {
    if (!nome || !email) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    setLoading(true);
    const result = await atualizarPerfil(nome, email);
    setLoading(false);

    if (result.success) {
      showToast('Perfil atualizado com sucesso!', 'success');
      setEditando(false);
      await carregarPerfil();
    } else {
      showToast(result.error || 'Erro ao atualizar perfil', 'error');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          showToast('Logout realizado com sucesso', 'info');
        },
      },
    ]);
  };

  const handleDeletarConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Implementar deleção de conta se necessário
              showToast('Funcionalidade em desenvolvimento', 'warning');
            } catch (error) {
              showToast('Erro ao excluir conta', 'error');
            }
          },
        },
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.nome)}</Text>
          </View>
        </View>
        <Text style={styles.nome}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </LinearGradient>

      {/* Card de Informações */}
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="person-outline" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Informações Pessoais</Text>
            </View>
            {!editando && (
              <TouchableOpacity
                onPress={() => setEditando(true)}
                style={styles.editButton}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {editando ? (
            <View>
              <Input
                label="Nome completo"
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                icon="person-outline"
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
              />
              <View style={styles.buttons}>
                <Button
                  title="Salvar alterações"
                  onPress={handleSalvar}
                  loading={loading}
                  fullWidth
                  icon="checkmark-circle-outline"
                  style={styles.button}
                />
                <Button
                  title="Cancelar"
                  variant="secondary"
                  onPress={() => {
                    setEditando(false);
                    setNome(user?.nome || '');
                    setEmail(user?.email || '');
                  }}
                  fullWidth
                  icon="close-circle-outline"
                  iconPosition="right"
                  style={styles.button}
                />
              </View>
            </View>
          ) : (
            <View style={styles.info}>
              <View style={styles.infoItem}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="person" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Nome</Text>
                </View>
                <Text style={styles.infoValue}>{user?.nome || '-'}</Text>
              </View>
              <View style={styles.infoItem}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons name="mail" size={18} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Email</Text>
                </View>
                <Text style={styles.infoValue}>{user?.email || '-'}</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Ações */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Sair da conta</Text>
              <Text style={styles.actionSubtitle}>Encerrar sua sessão atual</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleDeletarConta}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="trash-outline" size={24} color={colors.error} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.error }]}>
                Excluir conta
              </Text>
              <Text style={styles.actionSubtitle}>Remover permanentemente sua conta</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  editButton: {
    padding: 8,
  },
  info: {
    marginTop: 8,
  },
  infoItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  buttons: {
    marginTop: 8,
  },
  button: {
    marginTop: 12,
  },
  actionsSection: {
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
