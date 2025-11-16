import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { cadastrar } = useAuth();
  const { showToast } = useToast();

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      showToast('Preencha todos os campos', 'warning');
      return;
    }

    if (senha.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'warning');
      return;
    }

    if (senha !== confirmarSenha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setLoading(true);
    const result = await cadastrar(nome, email, senha);
    setLoading(false);

    if (result.success) {
      showToast('Conta criada com sucesso!', 'success');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } else {
      showToast(result.error || 'Erro ao criar conta', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para começar a gerenciar suas finanças
          </Text>
        </View>

        <View style={styles.form}>
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

          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Input
            label="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Digite a senha novamente"
            secureTextEntry
            icon="lock-closed-outline"
          />

          <Button
            title="Criar conta"
            onPress={handleCadastro}
            loading={loading}
            fullWidth
            icon="checkmark-circle-outline"
            style={styles.button}
          />

          <Button
            title="Já tenho uma conta"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
    padding: 8,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
});
