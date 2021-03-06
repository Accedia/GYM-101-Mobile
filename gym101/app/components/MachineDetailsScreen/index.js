import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid, FlatList } from 'react-native'
import { WebView } from 'react-native-webview'

import { fonts, colors } from '@config'
import secrets from '@secrets'
import i18n from '@i18n'

import camera from './../../static/images/camera.png'

export default class MachineDetailsScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }
  fetchData(appliance) {
    return new Promise((resolve, reject) => {
      console.log(`https://dr7v6vdke8.execute-api.us-east-1.amazonaws.com/dev/excercises?equipment=${encodeURIComponent(this.titleCase(appliance))}`)
      fetch(`https://dr7v6vdke8.execute-api.us-east-1.amazonaws.com/dev/excercises?equipment=${encodeURIComponent(this.titleCase(appliance))}`, {
        method: 'GET',
        headers: secrets.machineDetailsApi.headers
      })
        .then((response) => response.json())
        .then((responseJson) => {
          resolve(responseJson)
        }).catch((error) => {
          reject(error)
        });
    })
  }

  titleCase(str) {
    console.log("string to upper case: " + str);
    var splitStr = str.split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  componentDidMount() {
    // return this.setState({ isLoading: false })
    this.fetchData(this.props.navigation.state.params.appliance).then(data => {
      console.log(data[0]);
      this.setState({ isLoading: false, data: data[0] })
    }).catch(err => {
      console.log(err);
      ToastAndroid.show(err, ToastAndroid.LONG);
    });
  }

  goToCameraScreen() {
    this.props.navigation.navigate('Camera')
  }


  render() {
    const { data } = this.state
    // const data = {
    //   "equipment": "Leg Press",
    //   "exercises": [
    //     {
    //       "mainMuscleGroup": "Upper Legs",
    //       "name": "Leg Press",
    //       "otherMuscleGroups": ["Lower Legs", "Glutes"],
    //       "videoLink": "https://www.youtube.com/watch?v=3R0SOJ3alTA"
    //     },
    //     {
    //       "mainMuscleGroup": "Upper Legs",
    //       "name": "Leg Press",
    //       "otherMuscleGroups": ["Lower Legs", "Glutes"],
    //       "videoLink": "https://www.youtube.com/watch?v=3R0SOJ3alTA",
    //     },
    //   ]
    // }

    return (
      this.state.isLoading
        ? <Text> {i18n.t('loading')}... </Text>
        : <View style={styles.container}>
            <FlatList
              ListHeaderComponent={
                <View>
                  <Text style={styles.equipmentName}>{data.equipment}</Text>
                </View>
              }
              data={data.exercises}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                <View style={styles.exerciseContainer}>
                  <View>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                  </View>
                  <View style={styles.muscleGroupContainer}>
                    <Text style={styles.muscleGroupLabel}>
                      {i18n.t('machine-details-screen.main-muscle-group')}
                      : <Text style={styles.muscleGroup}>{item.mainMuscleGroup}</Text>
                    </Text>
                  </View>
                  <View style={styles.muscleGroupContainer}>
                    <Text style={styles.muscleGroupLabel}>
                      {i18n.t('machine-details-screen.other-muscle-groups')}
                      : <Text style={styles.muscleGroup}>{item.otherMuscleGroups.join(', ')}</Text>
                    </Text>
                  </View>
                  <WebView
                    style={{ flex: 1, height: 250, borderWidth: 1, borderColor: 'black' }}
                    javaScriptEnabled={true}
                    source={{ uri: item.videoLink.split('watch?v=').join('embed/') + '?rel=0&autoplay=0&showinfo=0&controls=0' }}
                  />
                </View>
              }
            />
            <View style={styles.overlayContainer}>
              <TouchableOpacity style={styles.navigationButton} onPress={() => this.goToCameraScreen()} >
                <Image source={camera}/>
              </TouchableOpacity>
            </View>
          </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  exerciseContainer: {
    paddingBottom: 10,
  },
  equipmentName: {
    fontFamily: fonts.regular,
    fontSize: 60,
  },
  exerciseName: {
    fontFamily: fonts.regular,
    fontSize: 30,
  },
  muscleGroupContainer: {
    paddingVertical: 3
  },
  muscleGroupLabel: {
    fontFamily: fonts.regular,
    fontSize: 20,

  },
  muscleGroup: {
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  overlayContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    borderRadius: 50,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    opacity: 0.8
  },
  overlay: {
    opacity: 1
  }

})