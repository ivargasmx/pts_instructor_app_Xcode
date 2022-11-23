import React, {useState, useEffect, Fragment} from 'react';
import {SafeAreaView, Text, View,StyleSheet} from 'react-native';

import {
  CodeField,  Cursor,  useBlurOnFulfill,  useClearByFocusCell,} from 'react-native-confirmation-code-field';



const CELL_COUNT = 6;


export default function App( params) { 
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,    setValue,  });


  useEffect(() => {
    (async () => {
    // console.log(params)


    })();
  }, []);
  



  const _onFulfill   = (code) => {  
    setValue("")
    params.parentWindow.setCodeHook(code)
  };
  return (
    <SafeAreaView style={styles.root}>
     { true && <Text style={styles.title}>{params.title}</Text>} 
      <CodeField
        ref={ref} 
        {...props}
        value={value}
        onChangeText={(value) => {setValue(value); if(value.length == CELL_COUNT) _onFulfill(value)  }} 
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => ( 
          <Fragment key={index}> 
            <Text
              key={`value-${index}`}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
            {index === 92 || index === 94 ? ( 
              <View key={`separator-${index}`} style={styles.separator} />
            ) : null}
          </Fragment>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {padding: 20, 
width: 250
},
title: {textAlign: 'center', 
fontSize: 20, 
backgroundColor:"transparent"
},
codeFieldRoot: {marginTop: 20
},
cell: {
    width: 25, 
   height: 30, 
   lineHeight: 28, 
   fontSize: 20, 
   borderWidth: 2, 
   borderRadius: 3, 
   borderColor: '#00000030', 
   textAlign: 'center', 
 
},
separator: {
    height: 2, 
   width: 10, 
   backgroundColor: '#000', 
   alignSelf: 'center', 
 
},
focusCell: {
    borderColor: '#000', 
 },});

