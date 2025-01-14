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

111111111111111111111111111111111111111111111111111111111111111111111
// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
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
//   const [events, setEvents] = useState<any[]>([]); // Store fetched events
//   const [showForm, setShowForm] = useState<boolean>(false); // State to control form visibility
//   const [loading, setLoading] = useState<boolean>(false); // Loading state for API call

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/getUpcomingEvents`);
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         alert('Failed to load events');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const handleSave = async () => {
//     const eventData = { from, fromCoords, destination, destinationCoords, eventDate, eventTime };
//     try {
//       const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/addfamilyEvent`, eventData, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status >= 200 && response.status < 300) {
//         alert('Event saved successfully!');
//         const updatedResponse = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/getUpcomingEvents`);
//         setEvents(updatedResponse.data);
//         setShowForm(false);
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

//           <Button title="Save Event" onPress={handleSave} />
//           <Button title="Cancel" onPress={() => setShowForm(false)} />
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
// });

111111111111111111111111111111111111111111111111111111111111111111111111

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, TextInput, FlatList, ActivityIndicator, ScrollView } from 'react-native';
// import axios from 'axios';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

// export default function FamilyEventScreen() {
//   const [from, setFrom] = useState<string>('');
//   const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [destination, setDestination] = useState<string>('');
//   const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [eventDate, setEventDate] = useState<string>('');
//   const [eventTime, setEventTime] = useState<string>('');
//   const [events, setEvents] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
//   const [isTimePickerVisible, setTimePickerVisibility] = useState<boolean>(false);
//   const [editingEvent, setEditingEvent] = useState<any | null>(null); // For editing events

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/getUpcomingEvents`);
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         alert('Failed to load events');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const handleSave = async () => {
//     if (!from || !destination || !eventDate || !eventTime) {
//       alert('Please fill out all fields!');
//       return;
//     }

//     const eventData = { from, fromCoords, destination, destinationCoords, eventDate, eventTime };

//     try {
//       if (editingEvent) {
//         // Update existing event
//         const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_URI}/updateEvent/${editingEvent.id}`, eventData, {
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (response.status >= 200 && response.status < 300) {
//           alert('Event updated successfully!');
//           setEvents((prevEvents) =>
//             prevEvents.map((event) => (event.id === editingEvent.id ? { ...event, ...eventData } : event))
//           );
//         }
//       } else {
//         // Create new event
//         const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/addfamilyEvent`, eventData, {
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (response.status >= 200 && response.status < 300) {
//           alert('Event saved successfully!');
//           setEvents([...events, response.data]);
//         }
//       }

//       setShowForm(false);
//       resetForm();
//     } catch (error) {
//       console.error('Error saving event:', error);
//       alert('Error saving event');
//     }
//   };

//   const handleDelete = async (eventId: number) => {
//     try {
//       await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URI}/deleteEvent/${eventId}`);
//       setEvents(events.filter((event) => event.id !== eventId));
//       alert('Event deleted successfully');
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       alert('Error deleting event');
//     }
//   };

//   const handleEdit = (event: any) => {
//     setEditingEvent(event);
//     setFrom(event.from);
//     setDestination(event.destination);
//     setEventDate(event.eventDate);
//     setEventTime(event.eventTime);
//     setShowForm(true);
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFrom('');
//     setFromCoords(null);
//     setDestination('');
//     setDestinationCoords(null);
//     setEventDate('');
//     setEventTime('');
//     setEditingEvent(null);  // Reset the editing state
//   };

//   const renderGooglePlacesInput = (
//     placeholder: string,
//     location: string,
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
//         key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`,
//         language: 'en',
//       }}
//       fetchDetails={true}
//       styles={{
//         container: { marginBottom: 15 }, // Increased margin for spacing
//         textInput: styles.input,
//         listView: styles.listView,
//       }}
//       textInputProps={{
//         value: location,
//         onChangeText: setLocation,
//       }}
//     />
//   );

//   const renderEventItem = ({ item }: { item: any }) => (
//     <View style={styles.eventItem}>
//       <Text>{`Event: ${item.from} to ${item.destination}`}</Text>
//       <Text>{`Date: ${item.eventDate}`}</Text>
//       <Text>{`Time: ${item.eventTime}`}</Text>
//       <Button title="Edit" onPress={() => handleEdit(item)} />
//       <Button title="Delete" onPress={() => handleDelete(item.id)} />
//     </View>
//   );

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Family Event</Text>

//       <Button title="Add New Event" onPress={() => setShowForm(true)} />

//       {showForm && (
//         <View style={styles.formContainer}>
//           {renderGooglePlacesInput('Where from?', from, setFrom, setFromCoords)}
//           {renderGooglePlacesInput('Where to?', destination, setDestination, setDestinationCoords)}

//           <TextInput
//             style={styles.input}
//             placeholder="Event Date"
//             value={eventDate}
//             onFocus={() => setDatePickerVisibility(true)}
//           />
//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             onConfirm={(date: Date) => {
//               setEventDate(date.toISOString().split('T')[0]);
//               setDatePickerVisibility(false);
//             }}
//             onCancel={() => setDatePickerVisibility(false)}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Event Time"
//             value={eventTime}
//             onFocus={() => setTimePickerVisibility(true)}
//           />
//           <DateTimePickerModal
//             isVisible={isTimePickerVisible}
//             mode="time"
//             onConfirm={(time: Date) => {
//               setEventTime(time.toTimeString().slice(0, 5));
//               setTimePickerVisibility(false);
//             }}
//             onCancel={() => setTimePickerVisibility(false)}
//           />

//           <Button title={editingEvent ? 'Update Event' : 'Save Event'} onPress={handleSave} />
//           <Button title="Cancel" onPress={handleCancel} />
//         </View>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//           data={events}
//           renderItem={renderEventItem}
//           keyExtractor={(item) => item.id.toString()}
//         />
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//   },
//   heading: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15, // Increased margin to separate fields more clearly
//     backgroundColor: '#fff',
//   },
//   listView: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   eventItem: {
//     padding: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   formContainer: {
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 5,
//   },
// });
