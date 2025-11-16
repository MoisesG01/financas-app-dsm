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
import { transacaoService, categoriaService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function NovaTransacaoScreen({ navigation, route }) {
  const tipoInicial = route?.params?.tipo || 'despesa';
  const { showToast } = useToast();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [tipo, setTipo] = useState(tipoInicial);
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    carregarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  const carregarCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const dados = await categoriaService.listar();
      const filtradas = dados.filter((cat) => cat.tipo === tipo);
      setCategorias(filtradas);
      
      // Sempre definir a primeira categoria se houver categorias disponíveis
      if (filtradas.length > 0) {
        // Quando o tipo muda, sempre definir a primeira categoria do novo tipo
        // Isso garante que sempre haverá uma categoria selecionada
        setIdCategoria(String(filtradas[0].id_categoria));
      } else {
        setIdCategoria('');
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      showToast('Erro ao carregar categorias', 'error');
      setIdCategoria('');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleSalvar = async () => {
    // Validação mais robusta
    if (!descricao || !descricao.trim()) {
      showToast('Preencha a descrição', 'warning');
      return;
    }

    if (!valor || !valor.trim()) {
      showToast('Preencha o valor', 'warning');
      return;
    }

    if (!data || !data.trim()) {
      showToast('Preencha a data', 'warning');
      return;
    }

    if (!idCategoria || idCategoria === '' || idCategoria === '0') {
      showToast('Selecione uma categoria', 'warning');
      return;
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      showToast('O valor deve ser maior que zero', 'warning');
      return;
    }

    setLoading(true);
    try {
      const categoriaId = parseInt(idCategoria);
      if (isNaN(categoriaId) || categoriaId <= 0) {
        throw new Error('Categoria inválida');
      }
      
      await transacaoService.criar(descricao.trim(), valor, data, tipo, categoriaId);
      showToast('Transação criada com sucesso!', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.erro || error.message || 'Erro ao criar transação';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LoadingOverlay visible={loading} message="Salvando transação..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Transação</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Seletor de Tipo */}
        <Card style={styles.tipoCard}>
          <Text style={styles.sectionTitle}>Tipo de Transação</Text>
          <View style={styles.tipoContainer}>
            <TouchableOpacity
              style={[
                styles.tipoButton,
                tipo === 'receita' && styles.tipoButtonActive,
                tipo === 'receita' && { backgroundColor: colors.receita },
              ]}
              onPress={() => {
                setTipo('receita');
                // Não limpar idCategoria aqui, deixar o useEffect gerenciar
              }}
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
              onPress={() => {
                setTipo('despesa');
                // Não limpar idCategoria aqui, deixar o useEffect gerenciar
              }}
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
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Supermercado, Salário..."
            icon="document-text-outline"
          />

          <Input
            label="Valor"
            value={valor}
            onChangeText={setValor}
            placeholder="0.00"
            keyboardType="decimal-pad"
            icon="cash-outline"
          />

          <Input
            label="Data"
            value={data}
            onChangeText={setData}
            placeholder="YYYY-MM-DD"
            icon="calendar-outline"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Categoria</Text>
            {loadingCategorias ? (
              <View style={styles.loadingCategoria}>
                <Text style={styles.loadingText}>Carregando categorias...</Text>
              </View>
            ) : categorias.length > 0 ? (
              <View style={styles.picker}>
                <Picker
                  selectedValue={idCategoria}
                  onValueChange={setIdCategoria}
                  style={styles.pickerStyle}
                >
                  {categorias.map((cat) => (
                    <Picker.Item
                      key={cat.id_categoria}
                      label={cat.nome}
                      value={String(cat.id_categoria)}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={styles.semCategoria}>
                <Ionicons name="alert-circle" size={24} color={colors.warning} />
                <Text style={styles.semCategoriaText}>
                  Nenhuma categoria de {tipo === 'receita' ? 'receita' : 'despesa'} cadastrada
                </Text>
                <Button
                  title="Criar Categoria"
                  variant="secondary"
                  onPress={() => navigation.navigate('NovaCategoria', { tipo })}
                  icon="add-circle-outline"
                  style={styles.criarCategoriaButton}
                />
              </View>
            )}
          </View>
        </Card>

        <Button
          title="Salvar Transação"
          onPress={handleSalvar}
          loading={loading}
          disabled={categorias.length === 0 || loading}
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
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pickerStyle: {
    height: 50,
  },
  loadingCategoria: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
  },
  semCategoria: {
    padding: 24,
    backgroundColor: colors.warning + '15',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  semCategoriaText: {
    color: colors.warningDark,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    fontWeight: '500',
  },
  criarCategoriaButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 8,
  },
});
