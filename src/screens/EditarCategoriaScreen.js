import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { categoriaService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function EditarCategoriaScreen({ navigation, route }) {
  const { id } = route.params;
  const categoriaId = Number(id);
  const { showToast } = useToast();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarCategoria();
  }, []);

  const carregarCategoria = async () => {
    try {
      const categoria = await categoriaService.buscarPorId(categoriaId);
      setNome(categoria.nome || '');
      setTipo(categoria.tipo || 'despesa');
    } catch (error) {
      showToast('Erro ao carregar categoria', 'error');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      showToast('Preencha o nome da categoria', 'warning');
      return;
    }

    setLoading(true);
    try {
      await categoriaService.atualizar(categoriaId, nome.trim(), tipo);
      showToast('Categoria atualizada com sucesso!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.erro || 'Erro ao atualizar categoria';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={true} message="Carregando categoria..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LoadingOverlay visible={loading} message="Salvando categoria..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Categoria</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Seletor de Tipo */}
        <Card style={styles.tipoCard}>
          <Text style={styles.sectionTitle}>Tipo de Categoria</Text>
          <View style={styles.tipoContainer}>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === 'receita' && styles.tipoButtonActive,
                tipo === 'receita' && { backgroundColor: colors.receita },
              ]}
              onPress={() => setTipo('receita')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-down"
                size={24}
                color={tipo === 'receita' ? '#fff' : colors.receita}
              />
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === 'receita' && styles.tipoButtonTextActive,
                ]}
              >
                Receita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === 'despesa' && styles.tipoButtonActive,
                tipo === 'despesa' && { backgroundColor: colors.despesa },
              ]}
              onPress={() => setTipo('despesa')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up"
                size={24}
                color={tipo === 'despesa' ? '#fff' : colors.despesa}
              />
              <Text
                style={[
                  styles.tipoButtonText,
                  tipo === 'despesa' && styles.tipoButtonTextActive,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Formulário */}
        <Card style={styles.formCard}>
          <Input
            label="Nome da categoria"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Alimentação, Transporte, Salário..."
            icon="folder-outline"
            autoCapitalize="words"
          />
        </Card>

        <Button
          title="Salvar Alterações"
          onPress={handleSalvar}
          loading={loading}
          disabled={!nome.trim() || loading}
          fullWidth
          icon="checkmark-circle-outline"
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  tipoCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  tipoContainer: {
    flexDirection: 'row',
  },
  tipoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 6,
    backgroundColor: colors.background,
  },
  tipoButtonActive: {
    borderColor: 'transparent',
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
  },
  tipoButtonTextActive: {
    color: '#fff',
  },
  formCard: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 8,
  },
});
