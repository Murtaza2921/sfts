// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
// import axios from 'axios';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function FamilyEventScreen() {
//   const [from, setFrom] = useState<string>('');
//   const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [destination, setDestination] = useState<string>('');
//   const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [eventDate, setEventDate] = useState<string>('');
//   const [eventTime, setEventTime] = useState<string>('');
//   const [fromQuery, setFromQuery] = useState<string>('');
//   const [destinationQuery, setDestinationQuery] = useState<string>('');
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

//   const handleSave = async () => {
//     const eventData = { 
//       from, 
//       fromCoords, 
//       destination, 
//       destinationCoords, 
//       eventDate, 
//       eventTime 
//     };
//     try {
//       const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/addfamilyEvent`, eventData, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status >= 200 && response.status < 300) {
//         alert('Event saved successfully!');
//       } else {
//         alert('Failed to save event');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error saving event');
//     }
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//       setEventDate(dateString);
//     }
//   };

//   const handleTimeChange = (event: any, selectedTime?: Date) => {
//     setShowTimePicker(false);
//     if (selectedTime) {
//       const timeString = selectedTime.toTimeString().slice(0, 5); // Format as HH:mm
//       setEventTime(timeString);
//     }
//   };

//   const renderGooglePlacesInput = (
//     placeholder: string,
//     query: string,
//     setQuery: React.Dispatch<React.SetStateAction<string>>,
//     setLocation: React.Dispatch<React.SetStateAction<string>>,
//     setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
//   ) => (
//     <GooglePlacesAutocomplete
//       placeholder={placeholder}
//       onPress={(data, details = null) => {
//         setLocation(data.description);
//         if (details && details.geometry) {
//           setCoords({
//             lat: details.geometry.location.lat,
//             lng: details.geometry.location.lng,
//           });
//         }
//       }}
//       query={{
//         key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
//         language: 'en',
//       }}
//       fetchDetails={true} // Ensures geometry details are fetched
//       styles={{
//         container: {
//           flex: 0,
//           marginBottom: 10,
//         },
//         textInput: {
//           height: 40,
//           color: '#000',
//           fontSize: 16,
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           paddingHorizontal: 10,
//         },
//         listView: {
//           position: 'absolute',
//           top: 50,
//           zIndex: 10,
//           backgroundColor: '#fff',
//           width: '100%',
//           borderRadius: 5,
//           borderWidth: 1,
//           borderColor: '#ddd',
//           elevation: 5,
//         },
//       }}
//       textInputProps={{
//         onChangeText: (text) => setQuery(text),
//         value: query,
//       }}
//       debounce={200}
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Add Family Event</Text>

//       {renderGooglePlacesInput('Where from?', fromQuery, setFromQuery, setFrom, setFromCoords)}
//       {renderGooglePlacesInput('Where to?', destinationQuery, setDestinationQuery, setDestination, setDestinationCoords)}

//       {/* Date Picker */}
//       <TextInput
//         style={styles.input}
//         placeholder="Event Date"
//         value={eventDate}
//         onFocus={() => setShowDatePicker(true)}
//       />
//       {showDatePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="date"
//           display="default"
//           onChange={handleDateChange}
//         />
//       )}

//       {/* Time Picker */}
//       <TextInput
//         style={styles.input}
//         placeholder="Event Time"
//         value={eventTime}
//         onFocus={() => setShowTimePicker(true)}
//       />
//       {showTimePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="time"
//           display="default"
//           onChange={handleTimeChange}
//         />
//       )}

//       <Button title="Save Event" onPress={handleSave} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
// });




// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
// import axios from 'axios';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function FamilyEventScreen() {
//   const [from, setFrom] = useState<string>('');
//   const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [destination, setDestination] = useState<string>('');
//   const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [eventDate, setEventDate] = useState<string>('');
//   const [eventTime, setEventTime] = useState<string>('');
//   const [fromQuery, setFromQuery] = useState<string>('');
//   const [destinationQuery, setDestinationQuery] = useState<string>('');
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
//   const [events, setEvents] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [editingEvent, setEditingEvent] = useState<any>(null);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/getUpcomingEvents`);
//       setEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       alert('Failed to load events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const eventData = {
//       from,
//       fromCoords: { lat: fromCoords?.lat, lng: fromCoords?.lng }, // Include fromCoords as an object
//       destination,
//       destinationCoords: { lat: destinationCoords?.lat, lng: destinationCoords?.lng }, // Include destinationCoords as an object
//       eventDate,
//       eventTime,
//     };

//     try {
//       const url = editingEvent
//         ? `${process.env.EXPO_PUBLIC_SERVER_URI}/editEvent/${editingEvent.id}`
//         : `${process.env.EXPO_PUBLIC_SERVER_URI}/addfamilyEvent`;
//       const method = editingEvent ? 'put' : 'post';
//       const response = await axios[method](url, eventData, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status >= 200 && response.status < 300) {
//         alert(editingEvent ? 'Event updated successfully!' : 'Event saved successfully!');
//         fetchEvents();
//         setShowForm(false);
//         setEditingEvent(null);
//       } else {
//         alert('Failed to save event');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error saving event');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URI}/deleteEvent/${id}`);
//       if (response.status >= 200 && response.status < 300) {
//         alert('Event deleted successfully!');
//         fetchEvents();
//       } else {
//         alert('Failed to delete event');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error deleting event');
//     }
//   };

//   const handleEdit = (event: any) => {
//     setEditingEvent(event);
//     setFrom(event.from);
//     setFromCoords({ lat: event.fromLat, lng: event.fromLng });
//     setDestination(event.destination);
//     setDestinationCoords({ lat: event.destinationLat, lng: event.destinationLng });
//     setEventDate(event.eventDate);
//     setEventTime(event.eventTime);
//     setShowForm(true);
//   };

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const dateString = selectedDate.toISOString().split('T')[0];
//       setEventDate(dateString);
//     }
//   };

//   const handleTimeChange = (event: any, selectedTime?: Date) => {
//     setShowTimePicker(false);
//     if (selectedTime) {
//       const timeString = selectedTime.toTimeString().slice(0, 5);
//       setEventTime(timeString);
//     }
//   };

//   const renderGooglePlacesInput = (
//     placeholder: string,
//     query: string,
//     setQuery: React.Dispatch<React.SetStateAction<string>>,
//     setLocation: React.Dispatch<React.SetStateAction<string>>,
//     setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
//   ) => (
//     <GooglePlacesAutocomplete
//       placeholder={placeholder}
//       onPress={(data, details = null) => {
//         setLocation(data.description);
//         if (details && details.geometry) {
//           setCoords({
//             lat: details.geometry.location.lat,
//             lng: details.geometry.location.lng,
//           });
//         }
//       }}
//       query={{
//         key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
//         language: 'en',
//       }}
//       fetchDetails
//       styles={{
//         container: { flex: 0, marginBottom: 10 },
//         textInput: {
//           height: 40,
//           color: '#000',
//           fontSize: 16,
//           borderWidth: 1,
//           borderColor: '#ccc',
//           borderRadius: 5,
//           paddingHorizontal: 10,
//         },
//         listView: {
//           position: 'absolute',
//           top: 50,
//           zIndex: 10,
//           backgroundColor: '#fff',
//           width: '100%',
//           borderRadius: 5,
//           borderWidth: 1,
//           borderColor: '#ddd',
//           elevation: 5,
//         },
//       }}
//       textInputProps={{
//         onChangeText: (text) => setQuery(text),
//         value: query,
//       }}
//       debounce={200}
//     />
//   );

//   const renderEventItem = ({ item }: { item: any }) => (
//     <View style={styles.eventItem}>
//       <Text>{`Event: ${item.from || 'N/A'} to ${item.destination || 'N/A'}`}</Text>
//       <Text>{`Date: ${item.eventDate || 'N/A'}`}</Text>
//       <Text>{`Time: ${item.eventTime || 'N/A'}`}</Text>
//       <View style={styles.buttonsContainer}>
//         <Button title="Edit" onPress={() => handleEdit(item)} />
//         <Button title="Delete" onPress={() => handleDelete(item.id)} />
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Family Event</Text>

//       <Button title="Add New Event" onPress={() => setShowForm(true)} />

//       {showForm && (
//         <View style={styles.formContainer}>
//           {renderGooglePlacesInput('Where from?', fromQuery, setFromQuery, setFrom, setFromCoords)}
//           {renderGooglePlacesInput('Where to?', destinationQuery, setDestinationQuery, setDestination, setDestinationCoords)}

//           <TextInput
//             style={styles.input}
//             placeholder="Event Date"
//             value={eventDate}
//             onFocus={() => setShowDatePicker(true)}
//           />
//           {showDatePicker && (
//             <DateTimePicker
//               value={new Date()}
//               mode="date"
//               display="default"
//               onChange={handleDateChange}
//             />
//           )}

//           <TextInput
//             style={styles.input}
//             placeholder="Event Time"
//             value={eventTime}
//             onFocus={() => setShowTimePicker(true)}
//           />
//           {showTimePicker && (
//             <DateTimePicker
//               value={new Date()}
//               mode="time"
//               display="default"
//               onChange={handleTimeChange}
//             />
//           )}

//           <Button title={editingEvent ? "Update Event" : "Save Event"} onPress={handleSave} />
//           <Button title="Cancel" onPress={() => { setShowForm(false); setEditingEvent(null); }} />
//         </View>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : events.length > 0 ? (
//         <FlatList
//           data={events}
//           renderItem={renderEventItem}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       ) : (
//         <Text>No upcoming events</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   heading: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   eventItem: {
//     padding: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//   },
//   formContainer: {
//     marginBottom: 20,
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FamilyEventScreen() {
  const [from, setFrom] = useState<string>('');
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [eventDate, setEventDate] = useState<string>('');
  const [eventTime, setEventTime] = useState<string>('');
  const [bid, setBid] = useState<string>('');
  const [noOfDays, setNoOfDays] = useState<string>('');
  const [description, setDescription] = useState<string>('');  // Add state for description
  const [fromQuery, setFromQuery] = useState<string>('');
  const [destinationQuery, setDestinationQuery] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/getUpcomingEvents`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const eventData = {
      from,
      fromCoords: { lat: fromCoords?.lat, lng: fromCoords?.lng },
      destination,
      destinationCoords: { lat: destinationCoords?.lat, lng: destinationCoords?.lng },
      eventDate,
      eventTime,
      bid: parseFloat(bid),
      noOfDays: parseInt(noOfDays, 10),
      description,  // Include description
    };

    try {
      const url = editingEvent
        ? `${process.env.EXPO_PUBLIC_SERVER_URI}/editEvent/${editingEvent.id}`
        : `${process.env.EXPO_PUBLIC_SERVER_URI}/addfamilyEvent`;
      const method = editingEvent ? 'put' : 'post';
      const response = await axios[method](url, eventData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status >= 200 && response.status < 300) {
        alert(editingEvent ? 'Event updated successfully!' : 'Event saved successfully!');
        fetchEvents();
        setShowForm(false);
        setEditingEvent(null);

        // Reset form fields after saving
        setFrom('');
        setFromCoords(null);
        setDestination('');
        setDestinationCoords(null);
        setEventDate('');
        setEventTime('');
        setBid('');
        setNoOfDays('');
        setDescription('');
      } else {
        alert('Failed to save event');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving event');
    }
  };


  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URI}/deleteEvent/${id}`);
      if (response.status >= 200 && response.status < 300) {
        alert('Event deleted successfully!');
        fetchEvents();
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting event');
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFrom(event.from);
    setFromCoords({ lat: event.fromLat, lng: event.fromLng });
    setDestination(event.destination);
    setDestinationCoords({ lat: event.destinationLat, lng: event.destinationLng });
    setEventDate(event.eventDate);
    setEventTime(event.eventTime);
    setBid(event.bid?.toString() || '');
    setNoOfDays(event.noOfDays?.toString() || '');
    setDescription(event.description || '');  // Set description when editing
    setShowForm(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      setEventDate(dateString);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toTimeString().slice(0, 5);
      setEventTime(timeString);
    }
  };

  const renderGooglePlacesInput = (
    placeholder: string,
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setLocation: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
  ) => (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      onPress={(data, details = null) => {
        setLocation(data.description);
        if (details && details.geometry) {
          setCoords({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      query={{
        key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
        language: 'en',
      }}
      fetchDetails
      styles={{
        container: { flex: 0, marginBottom: 10 },
        textInput: {
          height: 40,
          color: '#000',
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          paddingHorizontal: 10,
        },
        listView: {
          position: 'absolute',
          top: 50,
          zIndex: 10,
          backgroundColor: '#fff',
          width: '100%',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#ddd',
          elevation: 5,
        },
      }}
      textInputProps={{
        onChangeText: (text) => setQuery(text),
        value: query,
      }}
      debounce={200}
    />
  );


  const renderEventItem = ({ item }: { item: any }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{`${item.from || 'N/A'} to ${item.destination || 'N/A'}`}</Text>
      <Text style={styles.eventText}>{`Date: ${item.eventDate || 'N/A'}`}</Text>
      <Text style={styles.eventText}>{`Time: ${item.eventTime || 'N/A'}`}</Text>
      <Text style={styles.eventText}>{`Bid: ${item.bid || 'N/A'}`}</Text>
      <Text style={styles.eventText}>{`No. of Days: ${item.noOfDays || 'N/A'}`}</Text>
      <Text style={styles.eventText}>{`Description: ${item.description || 'N/A'}`}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconButton}>
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Family Event</Text>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Reset all fields before opening the form for adding a new event
          setFrom('');
          setFromCoords(null);
          setDestination('');
          setDestinationCoords(null);
          setEventDate('');
          setEventTime('');
          setBid('');
          setNoOfDays('');
          setDescription('');
          setEditingEvent(null); // Ensure no event is being edited
          setShowForm(true); // Open the form
        }}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>


      {/* Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderGooglePlacesInput('Where from?', fromQuery, setFromQuery, setFrom, setFromCoords)}
            {renderGooglePlacesInput('Where to?', destinationQuery, setDestinationQuery, setDestination, setDestinationCoords)}

            <TextInput
              style={styles.input}
              placeholder="Event Date"
              value={eventDate}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={eventDate ? new Date(eventDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Event Time"
              value={eventTime}
              onFocus={() => setShowTimePicker(true)}
            />
            {showTimePicker && (
              <DateTimePicker
                value={eventTime ? new Date(`1970-01-01T${eventTime}:00`) : new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Bid"
              value={bid}
              onChangeText={setBid}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="No. of Days"
              value={noOfDays}
              onChangeText={setNoOfDays}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Event Description"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>{editingEvent ? 'Update Event' : 'Save Event'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  // Reset form state and close the modal
                  setFrom('');
                  setFromCoords(null);
                  setDestination('');
                  setDestinationCoords(null);
                  setEventDate('');
                  setEventTime('');
                  setBid('');
                  setNoOfDays('');
                  setDescription('');
                  setEditingEvent(null);
                  setShowForm(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : events.length > 0 ? (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No upcoming events</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#333' },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  eventItem: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  eventText: { fontSize: 14, color: '#666' },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 999, // Ensure it's on top
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
