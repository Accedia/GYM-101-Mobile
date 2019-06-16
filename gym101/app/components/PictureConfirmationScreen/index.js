import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import i18n from '@i18n'
import { fonts } from '@config'
import FirebaseML from '@firebaseML'

export default function PictureConfirmationScreen(props) {

  function getPrediction(pictureUri) {
    return new Promise((resolve, reject) => {
      FirebaseML.show(
        pictureUri,
        error => {
          console.log(error);
          reject(error);
        },
        (appliance, confidence) => {
          console.log(appliance);
          console.log(confidence);
          resolve({ appliance, confidence});
        },
      )
    })
  }

  function tryNavigateForward(pictureUri) {
    getPrediction(pictureUri).then(prediction => {
      props.navigation.navigate('MachineDetails', prediction);
    }).catch(error => {
      console.log(error);
      // TODO insert toast message with the error and navigate backward!
    });
  }

  function navigateBackward() {

  }
  console.log('props', props)
  const pictureUri =  props.navigation.state.params.pictureUri //"file:///data/user/0/com.gym101/cache/Camera/10a3d859-f583-4c70-98ce-8f068c79d1d8.jpg" //

  return (
    <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10}}>
      <Text style={styles.explanation}>{ i18n.t('picture-confirmation-screen.explanation') }</Text>
      <View style={ styles.imageWrapper }>
        <Image
          style={ styles.image  }
          source={ { uri: pictureUri } }
        />
        <View>
          <TouchableOpacity onPress={() => tryNavigateForward(pictureUri)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SEND </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  explanation: { 
    fontFamily: fonts.regular,
    fontSize: 20,
    lineHeight: 22,
    paddingVertical: 10
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'stretch'
  },
  image: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
})