/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ScrollView,
  AsyncStorage,
} from 'react-native';

class ExpTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expirations: [],
      expirationName: '',
      expirationDate: '',
      expMonth: '',
      expDay: '',
      expYear: '',
    };
    this.updateExpirationName = this.updateExpirationName.bind(this);
    this.updateExpirationDate = this.updateExpirationDate.bind(this);
    this.addExpiration = this.addExpiration.bind(this);
    this.removeExpiration = this.removeExpiration.bind(this);
  }
  renderExpirationList() {
    if (this.state.expirations.length > 0) {
      return this.state.expirations.map((exp, i) => this.renderExpiration(exp, i));
    } else {
      return <Text style={{ color: '#bbb', margin: 10 }}>No Expirations Added</Text>
    }
  }
  removeExpiration(index) {
    const before = this.state.expirations.slice(0,index);
    const after = this.state.expirations.slice(index+1);
    this.setState({
       expirations: [...before, ...after],
    });
    this.storeExpirations();
  }
  renderExpiration(expiration, i) {
    return (
      <View key={i} style={i < this.state.expirations.length - 1 ? { borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', margin: 10} : {flexDirection: 'row', margin: 10}}>
        <TouchableHighlight style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} underlayColor="#fbb" onPress={() => this.removeExpiration(i)}>
          <Text>
            X
          </Text>
        </TouchableHighlight>
        <Text style={{flex: 10}}>
          {expiration.expirationName} on ({expiration.expirationDate})
        </Text>
      </View>
    );
  }
  updateExpirationName(expirationName) {
    this.setState({expirationName});
  }
  updateExpMonth(expMonth) {
    this.setState({expMonth});
  }
  updateExpDay(expDay) {
    this.setState({expDay});
  }
  updateExpYear(expYear) {
    this.setState({expYear});
  }
  updateExpirationDate(expirationDate) {
    let exp = `${expirationDate}`;
    if (exp.length > this.state.expirationDate.length) {
      const segments = exp.split('/');
      if (segments.length >= 3 && expirationDate[expirationDate.length-1] === '/') {
        return;
      }
      if (expirationDate[expirationDate.length] !== '1' && exp[exp.length-1] != '/' && segments.length < 3) {
        exp += '/';
      }
      if ((exp.length === 2 || exp.length === 5) && exp[exp.length-1] != '/' && segments.length < 3) {
        exp += '/';
      }
      if (segments[2] && segments[2].length > 2) {
        return;
      }
      if (expirationDate.length > 8) {
        return;
      }
    }
    this.setState({expirationDate: exp});
  }
  addExpiration() {
    const expiration = {
      expirationName: this.state.expirationName.trim(),
      expirationDate: this.state.expirationDate.trim(),
    };
    this.setState({
      expirations: [...this.state.expirations, expiration],
      expirationName: '',
      expirationDate: '',
    });
    this.storeExpirations();
  }
  storeExpirations() {
    AsyncStorage.setItem('expirations', JSON.stringify(this.state.expirations));
  }
  loadExpirations() {
    AsyncStorage.getItem('expirations').then((expirations) => {
      const parsed = JSON.parse(expirations);
      if (parsed) {
        this.setState({ expirations: parsed });
      }
    });
  }
  componentDidMount() {
    this.loadExpirations();
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome to ExpTracker</Text>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Add New Expiration</Text>
        </View>
        <View style={styles.inputFieldContainers}>
          <TextInput
            style={styles.inputFields}
            placeholder="What is Expiring?"
            value={this.state.expirationName}
            onChangeText={this.updateExpirationName}
          />
        </View>
        <View style={[styles.inputFieldContainers]}>
          <TextInput style={[styles.inputFields]} placeholder="MM"/>
          <TextInput style={[styles.inputFields]} placeholder="DD"/>
          <TextInput style={[styles.inputFields]} placeholder="YYYY"/>
        </View>
        { /*
        <View style={styles.inputFieldContainers}>
          <TextInput
            style={styles.inputFields}
            placeholder="MM/DD/YY"
            value={this.state.expirationDate}
            onChangeText={this.updateExpirationDate}
          />
        </View>
        */ }
        <TouchableHighlight
          style={styles.addButton}
          underlayColor="#41B9FF"
          onPress={this.addExpiration}
        >
          <View style={{flexDirection: 'row'}}>
            <Text style={{flex: 99, marginLeft: 50}}>Add Expiration</Text>
            <Text style={{flex: 5, marginRight: 25}}>&gt;</Text>
          </View>
        </TouchableHighlight>
        <ScrollView style={{marginTop: 50}}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Expirations Added</Text>
          </View>
          <View style={[{flex: 10, padding: 10}]}>
            {this.renderExpirationList()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputFieldContainers: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    marginBottom: 10,
    padding: 5,
    flexDirection: 'row',
  },
  inputFields: {
    flex: 1,
    height: 30,
    paddingLeft: 25,
    color: '#555',
    textAlign: 'center',
  },
  addButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2199E8',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const border = (color) => ({
  borderColor: color,
  borderWidth: 2,
});

const oldStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
  },
  fancyInput: {
    height: 60,
    borderColor: '#efefef',
    backgroundColor: '#f6f6f6',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    margin: 0,
    padding: 0,
  },
  addDrugInput: {
    height: 60,
  },
  addDrugExpInput: {
    height: 60,
  },
  addDrugButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteExpirationButton: {
    fontWeight: 'bold',
  },
});

AppRegistry.registerComponent('ExpTracker', () => ExpTracker);
