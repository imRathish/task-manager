# Task Manager Application

This repository contains a simple Task Manager application built using React and SCSS. The project demonstrates several best practices in code organization, modularity, and styling conventions to create a maintainable and scalable codebase.

## Best Practices and Rules Followed

### Separation of Concerns
- **Centralized API Calls:**  
  All network requests are moved to `apiUtils.js`, isolating API logic from UI components. This reduces duplication and improves maintainability.

### React Best Practices
- **Functional Components & Hooks:**  
  The project uses functional components along with React hooks (`useState`, `useEffect`) for state and lifecycle management.
- **Async/Await Usage:**  
  Asynchronous logic is handled with async/await to improve readability and simplify error handling.
- **Routing & Navigation:**  
  React Router is used to handle client-side navigation, keeping the app modular and the UI responsive.
- **Inline Comments:**  
  Each component includes clear, human-friendly inline comments explaining critical sections of the code.

### SCSS and Styling
- **BEM Naming Conventions:**  
  CSS classes are organized using the BEM (Block, Element, Modifier) methodology to ensure modular and easily maintainable styles.
- **Centralized Styling:**  
  Common styling properties like colors, typography, and spacing are stored in shared partials (`_variables.scss` and `_mixins.scss`). This helps keep the design consistent and makes global changes easier.
- **Reusable Mixins:**  
  Mixins for transitions and box shadows are used to avoid repetition and to ensure consistency across components.

### Code Organization
- **Component-Specific SCSS:**  
  Each React component has its own SCSS file that imports the shared styles, keeping component styling isolated yet consistent.
- **Reusable UI Components:**  
  Where applicable, patterns like modals and pills (for status and priority) were considered for reuse to minimize duplication.

## Limitations and Areas for Improvement

### State Management
- **Local State Only:**  
  The application relies on local component state (via React hooks) rather than a global state management solution like Redux. This decision was made for simplicity given the current scope.

### Testing
- **No Unit or Integration Tests:**  
  While the project is structured for maintainability, unit tests and integration tests have not been implemented. For a production-level project, testing frameworks such as Jest and React Testing Library would be incorporated.

### Error Handling
- **Basic Error Handling:**  
  Error handling is implemented in API calls; however, a more robust solution (e.g., global error boundaries or user-friendly error messages) is needed for production.

### Performance and Optimization
- **Code Splitting and Lazy Loading:**  
  These optimizations are not implemented in the current version but would be essential for larger applications.
  
### Accessibility & Internationalization
- **Accessibility Enhancements:**  
  While basic accessibility practices are followed (such as proper form labels), additional work is needed to meet full accessibility standards.
- **No Internationalization (i18n):**  
  The project does not currently support multiple languages.

## Conclusion

This Task Manager application demonstrates a modular approach to building web applications by following modern React best practices and SCSS methodologies. By centralizing API calls, reusing common styles via shared SCSS partials, and using functional components with hooks, the project is designed to be scalable and maintainable. Although there are areas for further enhancement—such as global state management, testing, advanced error handling, and performance optimizations—this project provides a solid foundation and a clear demonstration of coding best practices.

