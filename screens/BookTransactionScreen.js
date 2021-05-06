import React from 'react';
import {Text , View, TouchableOpacity,StyleSheet,TextInput,Image} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';


export default class TransactionScreen extends React.Component {
constructor(){
  super();
  this.state={
    hasCameraPermissions: null,
    scanned: false,
     scannedData: '', 
    buttonState: 'normal',
    scannedBookId:'',
scannedStudentId:'',
transactionMessage : ''

  }
}
getCameraPermissions=async(id)=>{
  const {status} = await Permissions.askAsync(Permissions.CAMERA);
this.setState({
hasCameraPermissions:"granted" ,
buttonState:id,
scanned: false,

}
);
}
handleBarCodeScaned=async({type,data})=>{
  const {buttonState} = this.state
  if(buttonState=="BookId"){

   this.setState({
    scanned:true,
     scannedBookId: data, 
    buttonState: 'normal'
});
}
else 
 if(buttonState=="StudentId"){

   this.setState({
    scanned:true,
      scannedStudentId:data, 
    buttonState: 'normal'
   }
   );
 }
}
  

handleTransaction= async()=>{
  var transactionMessage=null;
  db.collection("books").doc(this.state.scannedBookId).get()
  .then((doc) => {
    var book=doc.data();
    if(book.bookAvailability){
      this.initiateBookIssue( );
      transactionMessage="Book Issued";
      
    } // end of if 
else 
{
this.initiateBookReturn();
transactionMessage="Book Returned";
     
}
  
  })
  this.setState({
    transactionMessage:transactionMessage
    
  }
    )

}//end of handle transaction



  initiateBookIssue=async()=> {
db.collection("transaction").add({
'studentId': this.state.scannedStudentId,
'bookId':this.state.scannedBookId,
'date':firebase.firestore.Timestamp.now().toDate(),
'transactionType':"Issued"

}) //end of initateBookIssue

//change the book status
db.collection("books").doc(this.state.scannedBookId).update({
  'bookAvailability' : false
})
db.collection("students").doc(this.state.scannedstudentId).update({
  'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
})

this.setState({
  scannedStudentId:'',
  scannedBookId:''
})
  }


initiateBookReturn=async()=> {
  db.collection("transaction").add({
  'studentId': this.state.scannedStudentId,
  'bookId':this.state.scannedBookId,
  'date':firebase.firestore.Timestamp.now().toDate(),
  'transactionType':"Return"
  
  }) //end of initateBookIssue
  

  db.collection("books").doc(this.state.scannedBookId).update({
    'bookAvailability' : false
  })

  db.collection("students").doc(this.state.scannedstudentId).update({
    'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
  })


  this.setState({
    scannedStudentId:'',
    scannedBookId:''
  })



}


  



    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState != "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
          <View> 
          <Image source={require("../assets/booklogo.jpg")} style={{width:200, height: 200}}/> 
          <Text style={{textAlign: 'center', fontSize: 20}}>LIBRARY</Text>
           </View>

<View style={styles.inputView}>
<TextInput style={styles.inputBox} placeholder="BOOK-id " value={this.state.scannedBookId}/>
<TouchableOpacity styles={styles.scanButton}
onPress={()=>{ this.getCameraPermissions("BookId") }}>
<Text style={styles.buttonText}> scan </Text>
</TouchableOpacity>
</View>


<TouchableOpacity
          style={styles.submitButton} onPress={async()=>{
          this.handleTransaction()}}>
            
  <Text style={styles.submitButtonText}> Submit  </Text>
</TouchableOpacity>

<View style={styles.inputView}>
<TextInput style={styles.inputBox} placeholder="STUDENT-id "value={this.state.scannedStudentId}/>
<TouchableOpacity styles={styles.scanButton}
onPress={()=>{ this.getCameraPermissions("StudentId") }}>
<Text style={styles.buttonText}> scan </Text>
</TouchableOpacity>
</View>
</View>
        )
      }
    }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },

    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },

    scanButton:{
      backgroundColor: '#66BBA',
      padding: 10,
      margin: 10
    },

    buttonText:{
      fontSize: 20,
      textAlign:'center',
      marginTop:10
    },
    inputView:{
      flexDirection:'row',
      matgin:20
    },
    inputBox:{
      width: 200,
       height: 40,
        borderWidth: 1.5,
         borderRightWidth: 0,
          fontSize: 20
    },
submitButton:{
  backgroundColor:'red',
  width:100,
  height:50
}  ,
  submitButtonText:{
    padding:10,
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color: 'white'
  
  },

  });









