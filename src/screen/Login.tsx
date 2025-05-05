import React, {useState} from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

import { FirebaseError } from "firebase/app";
import { auth } from '../firebaseConfig';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { themes } from '../styles/themes';
import { Loading } from '../components/Loading';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [alert, setAlert] = useState("");
  const [ loading, setLoading ] = useState(false);

  async function handleLogin (){
    if(email === "" || senha === ""){
      setAlert("Preeche todos os campos!");
    }else{
      setLoading(true);
      try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const id = user.uid;
        setAlert("");
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        navigation.navigate('Home', { userId: id });
        setEmail("");
        setSenha("");
      }catch( error ){
        const firebaseError = error as FirebaseError;

        if (firebaseError.code === 'auth/weak-password') {
          setAlert("Sua senha deve ter pelo menos 6 caracteres.");
        } else if (firebaseError.code === 'auth/invalid-email') {
          setAlert("Email inválido. Verifique e tente novamente.");
        } else if (firebaseError.code === 'auth/email-already-in-use') {
          const login = await signInWithEmailAndPassword(auth, email, senha );
  
          const id = login.user.uid;

          navigation.navigate('Home', { userId: id });

        } else if (firebaseError.code === 'auth/missing-email') {
          setAlert("O campo de email está vazio.");
        }else if (firebaseError.code === 'auth/network-request-failed') {
          setAlert("Conecta-te a internet por favor.");
        }else if (firebaseError.code === 'auth/wrong-password') {
          setAlert("Senha incorreta. Verifique e tente novamente.");
        } else {
          setAlert("Erro inesperado. Tente novamente mais tarde.");
          console.error("Erro ao criar conta:", firebaseError);
        }
      }finally{
        setLoading(false);
      }
    }
  }
  async function resetPassword(){
    if(email === ""){
      Alert.alert("Email não existente", "Adiciona o teu email para poder recuperar a senha");
    }else{
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert("E-mail de recuperação enviado com sucesso!");
      } catch (error) {
        const firebaseError = error as FirebaseError;
        
        if (firebaseError.code === "auth/user-not-found") {
          Alert.alert("E-mail não encontrado.");
        } else if (firebaseError.code === "auth/invalid-email") {
          Alert.alert("E-mail inválido.");
        } else {
          Alert.alert("Erro ao enviar e-mail. Tente novamente.");
        }
      }
    }
  }

  return (
    <View className='
      flex-1
      bg-background
      items-center
      justify-center
    '>
      <View className='px-10 pt-14 w-full justify-center items-center'>
        <FontAwesome6 name="unlock-keyhole" size={58} color="#2F80ED" />
        <Text className='text-base text-primary uppercase'>Gerador de Senhas</Text>
      </View>

      <View className='w-full px-8'>
        <Text className='text-error font-bold text-sm'>{alert}</Text>
        <Input 
          title='Email'
          value={email}
          keyboardType='email-address'
          onChangeText={setEmail}
        />
        <Input 
          title='Senha'
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity 
          className='pt-2 items-end'
          onPress={resetPassword}
        >
          <Text className='text-primary font-bold'>Esqueci a minha palavra-passe</Text>
        </TouchableOpacity>

        {loading ? (
          <Loading color={themes.colors.btn} />
        ) : (
          <Button
            title='Entrar ou Cadastrar-se'
            onPress={handleLogin}
            color={themes.colors.btn}
          />
        )}
      </View>

    </View>
  );
}