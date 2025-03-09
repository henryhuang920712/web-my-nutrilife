
### Components
- **calendar**
    - **datePicker.js**: date picker
- **dashboard**
    - **charts**
        - **dailyProgress.js**: progress for daily intake

        - **caloriesBreakdown.js**: circle progress for three main components
        - **nutrientAnalysis.js**: line chart for historical intake and recommended intake of three main components
        - **dailyComposition.js**: progress for other nutrients intake
        - **recordView.js**: table view for meal records
    - **dailyIntakeProvider.js**: context provider for single day intake data

- **dropdown**
    - **optionMenu.js**: dropdown menu on navbar for user profile

- **modal**
    - **modal.js**: basic modal component
    - **loginModal.js**: login modal
    - **registerModal.js**: register modal

- **record**
    - **mealTracker.js**: table view for meal records, with edit and delete function

- **authProvider.js**: auth provider for user authentication, enfolding the components using user data

- ~~**imageSlider.js**~~: useless component

- **navbar.js**: navbar component

- **navbarSearch.js**: search bar on navbar

- **searchFood.js**: search result display

- **searchInfo.js**: dropdown menu for search result

### API

- **auth**
    - **options.js**: options for user authentication

- **food**
    - **route.js**: select all food data

- **foodSearch**
    - **route.js**: select food data by search query

- **meal**
    - **add**
        - **route.js**: add meal record
    - **delete**
        - **route.js**: delete meal record
    - **list**
        - **route.js**: list meal records

- **nutrient**
    - **route.js**: select nutrient data for a food
    - **list**
        - **route.js**: list nutrient intake for a user from start date to end date

- **nutrientAnalysis**
    - **route.js**: list daily nutrient consumed data for a nutrient and a user from start date to end date

- **user**
    - **route.js**: authenticate user


    