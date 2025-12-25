# AI Rules for StockFlow ERP Application

This document outlines the core technologies used in the StockFlow ERP application and provides clear guidelines for library usage to maintain consistency, performance, and maintainability.

## Tech Stack Description

*   **Frontend Framework**: React with TypeScript for building dynamic user interfaces.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first CSS, enabling rapid and consistent styling.
*   **UI Components**: shadcn/ui, a collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Routing**: React Router DOM for declarative client-side navigation.
*   **State Management**: Zustand for simple and efficient global state management.
*   **Server State Management**: Tanstack Query for data fetching, caching, and synchronization with the server.
*   **Backend & Authentication**: Supabase for database, authentication, and real-time capabilities.
*   **Icons**: Lucide React for a consistent and customizable icon set.
*   **Form Management**: React Hook Form with Zod for robust form validation and handling.
*   **Notifications**: Sonner for elegant and accessible toast notifications.
*   **Date Utilities**: date-fns for comprehensive date manipulation and formatting.

## Library Usage Rules

To ensure a cohesive and maintainable codebase, please adhere to the following rules when developing or modifying the application:

1.  **UI Components**:
    *   **Always** prioritize `shadcn/ui` components for all UI elements (buttons, inputs, dialogs, selects, tables, etc.).
    *   If a required component is not available in `shadcn/ui` or needs significant deviation from its design, create a **new component** in `src/components/` and style it using Tailwind CSS. **Do NOT modify existing `shadcn/ui` component files directly.**

2.  **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid writing custom CSS files or inline styles unless absolutely necessary for dynamic, computed style values.
    *   Ensure responsiveness by utilizing Tailwind's responsive utility classes.

3.  **State Management**:
    *   For global client-side state that doesn't involve server interaction (e.g., UI preferences, temporary form data), use **Zustand**.
    *   For managing server data, including fetching, caching, updating, and error handling, use **Tanstack Query**. This includes data from Supabase.

4.  **Routing**:
    *   All client-side navigation must be handled using **React Router DOM**.
    *   Define main application routes within `src/App.tsx`.
    *   Use the `NavLink` component from `src/components/NavLink.tsx` for navigation links to ensure proper active state styling.

5.  **Icons**:
    *   Use icons from the **`lucide-react`** library.

6.  **Forms**:
    *   Implement all forms using **`react-hook-form`** for controlled inputs and validation.
    *   For schema-based form validation, use **Zod** in conjunction with `@hookform/resolvers/zod`.

7.  **Notifications**:
    *   Use **Sonner** for displaying all toast notifications (e.g., success messages, error alerts). The `Sonner` component is already integrated into `src/App.tsx`.

8.  **Date Handling**:
    *   For any date parsing, formatting, or manipulation, use **`date-fns`**.

9.  **API Interaction (Supabase)**:
    *   All interactions with the Supabase backend (authentication, database CRUD operations) must use the `supabase` client instance exported from `src/lib/supabase.ts`.
    *   Ensure proper error handling for all Supabase calls.

10. **File Structure**:
    *   New components should be placed in `src/components/`.
    *   New pages should be placed in `src/pages/`.
    *   Utility functions should reside in `src/lib/` (e.g., `src/lib/utils.ts`, `src/lib/formatters.ts`).
    *   Store definitions should be in `src/store/`.

11. **Code Quality**:
    *   Adhere to TypeScript best practices, ensuring strong typing throughout the application.
    *   Write clean, readable, and well-commented code.
    *   Prioritize creating small, focused components and functions.
    *   Avoid over-engineering; implement the simplest solution that meets the requirements.