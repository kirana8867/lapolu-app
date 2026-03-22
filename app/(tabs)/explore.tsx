import { View, Text, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={s.container}>
      <Text style={s.text}>LAPOLU</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#FEF6EC',alignItems:'center',justifyContent:'center'},
  text:{fontSize:24,color:'#48426D',fontWeight:'700'},
});