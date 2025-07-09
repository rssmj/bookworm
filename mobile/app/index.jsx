import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BookWorm🐛</Text>

      <Link href='/(auth)/signup'>Signup</Link>
      <Link href='/(auth)'>Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'green',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'JetBrainsMono-Medium',
    marginBottom: 20,
  },
});
