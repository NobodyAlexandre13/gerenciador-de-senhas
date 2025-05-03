import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { 
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
  Inter_600SemiBold
} from '@expo-google-fonts/inter';

import "./src/styles/global.css";
import { Loading } from './src/components/Loading';
import { Stacks } from './src/routes';
import { NavigationContainer } from '@react-navigation/native';
import { themes } from './src/styles/themes';

export default function App() {
  const [ loadedFonts ] = useFonts([
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  ])

  if(!loadedFonts){
      return(
        <View className='
          flex-1 
          justify-center 
          items-center
          '
        >
          <Loading color={themes.colors.primary} />
        </View>
      )
    }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stacks />
    </NavigationContainer>
  );
}
