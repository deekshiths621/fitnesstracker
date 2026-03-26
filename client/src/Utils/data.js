import {
  FitnessCenterRounded,
  LocalFireDepartmentRounded,
  TimelineRounded,
} from "@mui/icons-material";

export const counts = [
  {
    name: "Calories Burned",
    icon: (
      <LocalFireDepartmentRounded sx={{ color: "inherit", fontSize: "26px" }} />
    ),
    desc: "Total calories burned today",
    key: "totalCaloriesBurnt",
    unit: "kcal",
    color: "#eb9e34",
    lightColor: "#FDF4EA",
  },
  {
    name: "Workouts",
    icon: <FitnessCenterRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Total no of workouts for today",
    key: "totalWorkouts",
    unit: "",
    color: "#41C1A6",
    lightColor: "#E8F6F3",
  },
  {
    name: "Average  Calories Burned",
    icon: <TimelineRounded sx={{ color: "inherit", fontSize: "26px" }} />,
    desc: "Average Calories Burned on each workout",
    key: "avgCaloriesBurntPerWorkout",
    unit: "kcal",
    color: "#FF9AD5",
    lightColor: "#FEF3F9",
  },
];

// Workout Categories
export const workoutCategories = [
  { id: "Chest", label: "Chest" },
  { id: "Back", label: "Back" },
  { id: "Legs", label: "Legs" },
  { id: "Shoulders", label: "Shoulders" },
  { id: "Arms", label: "Arms - Biceps" },
  { id: "Triceps", label: "Arms - Triceps" },
  { id: "Abs", label: "Abs/Core" },
  { id: "Cardio", label: "Cardio" },
  { id: "Full Body", label: "Full Body" },
];

// Exercises by category
export const exercisesByCategory = {
  Chest: [
    "Bench Press",
    "Incline Press",
    "Decline Press",
    "Dumbbell Press",
    "Push Ups",
    "Chest Fly",
    "Decline Push Ups",
  ],
  Back: [
    "Pull Ups",
    "Lat Pulldown",
    "Barbell Row",
    "Dumbbell Row",
    "Assisted Pull Up",
    "T-Bar Row",
    "Deadlift",
  ],
  Legs: [
    "Squats",
    "Leg Press",
    "Leg Curl",
    "Leg Extension",
    "Lunges",
    "Romanian Deadlift",
    "Calf Raises",
    "Back Squat",
  ],
  Shoulders: [
    "Military Press",
    "Shoulder Press",
    "Lateral Raise",
    "Front Raise",
    "Reverse Fly",
    "Pike Push Ups",
    "Shrugs",
  ],
  Arms: [
    "Barbell Curl",
    "Dumbbell Curl",
    "Cable Curl",
    "Hammer Curl",
    "Preacher Curl",
    "Machine Curl",
  ],
  Triceps: [
    "Tricep Dips",
    "Tricep Pushdown",
    "Overhead Extension",
    "Skull Crusher",
    "Rope Pushdown",
    "Close Grip Press",
  ],
  Abs: [
    "Crunches",
    "Sit Ups",
    "Planks",
    "Leg Raises",
    "Cable Crunch",
    "Ab Wheel",
    "Russian Twists",
  ],
  Cardio: ["Running", "Cycling", "Rowing", "Jump Rope", "Swimming", "Elliptical"],
  "Full Body": ["Burpees", "Mountain Climbers", "Jumping Jacks", "Mixed Exercises"],
};
