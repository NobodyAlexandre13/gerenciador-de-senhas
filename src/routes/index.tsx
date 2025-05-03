import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../screen/Home';
import Login from '../screen/Login';
import { Pass } from '../screen/Pass';

const {Navigator, Screen} = createStackNavigator();

export function Stacks (){
    return(
        <Navigator 
            screenOptions={{
                headerShown: false
            }}
        >
            <Screen name="Login" component={Login}/>
            <Screen name="Home" component={Home}/>
            <Screen name="Pass" component={Pass}/>
        </Navigator>
    )

}