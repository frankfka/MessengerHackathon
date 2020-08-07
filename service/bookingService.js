/**
 Mock functions for a backend API, which would normally provide things like appointment
 availability and serve as a database.
 */

// Mock return content
const ID_KEY = "id"
const NAME_KEY = "fullName"
const AVAILABILITY_KEY = "availability"
const AVAILABILITY_DISPLAY_KEY = "display"
const AVAILABILITY_DATA_KEY = "data"
function generateAvailability(display) {
  return {
    display: display,
    data: `${display}Timestamp`,
  }
}
const THERAPIST_DATA = {
  any: {
    id: "any",
    fullName: "Any",
    availability: ["10AM", "11AM", "12PM", "1:30PM", "3:30PM", "5PM"].map(generateAvailability)
  },
  karen_romero: {
    id: "karen_romero",
    fullName: "Karen Romero",
    availability: ["10AM", "12PM", "5PM"].map(generateAvailability)
  },
  tom_lee: {
    id: "tom_lee",
    fullName: "Tom Lee",
    availability: ["1:30PM", "3:30PM"].map(generateAvailability)
  },
  carrie_rodriguez: {
    id: "carrie_rodriguez",
    fullName: "Carrie Rodriguez",
    availability: ["10AM", "11AM", "12PM", "1:30PM"].map(generateAvailability)
  }
}

function getAvailableTherapists() {
  return Object.values(THERAPIST_DATA)
}

function getAvailableTimes(therapistId) {
  return THERAPIST_DATA[therapistId][AVAILABILITY_KEY]
}

function getTherapist(therapistId) {
  return THERAPIST_DATA[therapistId]
}

module.exports = {
  ID_KEY,
  NAME_KEY,
  AVAILABILITY_DISPLAY_KEY,
  AVAILABILITY_DATA_KEY,

  getAvailableTherapists,
  getAvailableTimes,
  getTherapist
}