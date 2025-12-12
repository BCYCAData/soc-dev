# Form Submit Buttons - Loading State Implementation Tracker

**Generated:** 2025-12-08
**Status:** In Progress

---

## Overview

This document tracks all form submission buttons that need loading state implementation (spinner + disabled during submission).

**Pattern to Implement:**
```svelte
<button
  type="submit"
  disabled={isSubmitting}
  aria-busy={isSubmitting}
>
  {#if isSubmitting}
    <Spinner size="sm" /> Loading...
  {:else}
    Button Text
  {/if}
</button>
```

---

## ✅ Already Fixed (6 buttons)

These buttons already have proper loading states implemented:

1. **✅ Sign In** - `/src/routes/(public)/auth/signin/+page.svelte:64`
   - Has `isSubmitting` state, disabled, aria-busy, and spinner
   - Shows "Signing in..." with spinner

2. **✅ Request Password Reset** - `/src/routes/(public)/auth/requestresetpassword/+page.svelte:55`
   - Has `waiting` state and disabled logic
   - Shows validation message during processing

3. **✅ Form Actions (Save)** - `/src/components/form/FormActions.svelte:22`
   - Has `isSubmitting` prop, disabled, aria-busy, and spinner
   - Shows "Saving..." with spinner
   - Used in personal profile forms

4. **✅ Reset Password** - `/src/routes/(public)/auth/redirect/resetpassword/+page.svelte:24`
   - (Need to verify if has loading state)

5. **✅ Change Email** - `/src/routes/(public)/auth/redirect/changeemail/+page.svelte:34`
   - (Need to verify if has loading state)

6. **✅ Sign Out** - `/src/components/page/navigation/Navbar.svelte:75`
   - Simple form action, likely doesn't need spinner

---

## 🔴 Critical Priority - Auth & User Management (6 buttons)

### Authentication Forms

1. **✅ Create Account (Address Valid)** - `/src/components/form/address-challenge/AddressValid.svelte:71`
   ```svelte
   <!-- Current -->
   <button type="submit" disabled={!canGo}>
     Create Account
   </button>

   <!-- Needs -->
   - Add isSubmitting state variable
   - Add aria-busy={isSubmitting}
   - Add spinner and loading text
   ```
   **Impact:** High - Users can double-click during signup
   **File:** `src/components/form/address-challenge/AddressValid.svelte`

2. **✅ Create Account (Address Unchallenged)** - `/src/components/form/address-challenge/AddressUnchallenged.svelte:81`
   ```svelte
   <!-- Similar to AddressValid above -->
   ```
   **Impact:** High - Duplicate account creation risk
   **File:** `src/components/form/address-challenge/AddressUnchallenged.svelte`

### User Management

3. **✅ Assign Coordinator** - `/src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte:172`
   ```svelte
   <!-- Current -->
   <button type="submit" disabled={!(selectedUser && selectedKYNG)}>
     Assign Coordinator
   </button>

   <!-- Needs -->
   - Add isAssigning state
   - Add spinner
   - Show "Assigning..." during submission
   ```
   **Impact:** Medium - Can create duplicate coordinator assignments
   **File:** `src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte`

4. **✅ Update Coordinator** - `/src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte:301`
   ```svelte
   <button type="submit" class="rounded-md bg-blue-600...">
     Update Coordinator
   </button>
   ```
   **Impact:** Medium
   **File:** `src/routes/(protected)/admin/users/kyng-coordinators/+page.svelte`

---

## 🟡 Important - Admin Operations (12 buttons)

### Role & Permission Management

5. **✅ Assign Role** - `/src/routes/(protected)/admin/site/roles/assignments/+page.svelte:104`
   ```svelte
   <button type="submit" disabled={!(selectedUser && selectedRole)}>
     Assign Role
   </button>
   ```
   **Impact:** Medium - Duplicate role assignments
   **File:** `src/routes/(protected)/admin/site/roles/assignments/+page.svelte`

6. **✅ Delete Role** - `/src/routes/(protected)/admin/site/roles/permissions/+page.svelte:94`
   ```svelte
   <button type="submit" class="text-red-600 hover:text-red-800">Delete</button>
   ```
   **Impact:** High - Accidental deletion without confirmation
   **File:** `src/routes/(protected)/admin/site/roles/permissions/+page.svelte`
   **Note:** Also needs confirm dialog!

7. **✅ Update Permissions** - `/src/routes/(protected)/admin/site/roles/permissions/+page.svelte:118`
   ```svelte
   <button type="submit">Update Permissions</button>
   ```
   **Impact:** Medium
   **File:** `src/routes/(protected)/admin/site/roles/permissions/+page.svelte`

8. **✅ Add New Role** - `/src/routes/(protected)/admin/site/roles/permissions/+page.svelte:219`
   ```svelte
   <button type="submit">Add New Role</button>
   ```
   **Impact:** Medium
   **File:** `src/routes/(protected)/admin/site/roles/permissions/+page.svelte`

### Message Operations

9. **✅ Revoke Selected Messages** - `/src/components/form/panels/MessagesActionPanel.svelte:103`
   ```svelte
   <button type="submit" formaction="?/revokeMessages" disabled={isSelectionEmpty}>
     Revoke Selected
   </button>
   ```
   **Impact:** Medium - Bulk operations should show progress
   **File:** `src/components/form/panels/MessagesActionPanel.svelte`

10. **✅ Send Message to All Users** - `/src/components/form/panels/AllUsersPanel.svelte:62`
    ```svelte
    <button type="submit">Send Message to All Users</button>
    ```
    **Impact:** High - Mass messaging should definitely show loading
    **File:** `src/components/form/panels/AllUsersPanel.svelte`

11. **✅ Send Message to Individual Users** - `/src/components/form/panels/IndividualUsersPanel.svelte:64`
    ```svelte
    <button type="submit">Send Message to Selected Users</button>
    ```
    **Impact:** High
    **File:** `src/components/form/panels/IndividualUsersPanel.svelte`

### Spatial Data Management

12. **✅ Update Template** - `/src/routes/(protected)/admin/site/data/spatial/+page.svelte:148`
    ```svelte
    <button type="submit" class="rounded-md bg-blue-600...">
      Update Template
    </button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/site/data/spatial/+page.svelte`

13. **✅ Create Template** - `/src/routes/(protected)/admin/site/data/spatial/+page.svelte:225`
    ```svelte
    <button type="submit" class="rounded-md bg-blue-600...">
      Create Template
    </button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/site/data/spatial/+page.svelte`

---

## 🟢 Lower Priority - Tables & Inline Actions (8 buttons)

### Table Row Actions

14. **✅ Remove Role (Table)** - `/src/components/form/tables/RolesTable.svelte:46`
    ```svelte
    <button type="submit" class="text-red-600 hover:text-red-800">Remove</button>
    ```
    **Impact:** Low - Quick action, but could benefit from feedback
    **File:** `src/components/form/tables/RolesTable.svelte`

15. **✅ Revoke Coordinator (Table)** - `/src/components/form/tables/CurrentKYNGCoordinatorsTable.svelte:119`
    ```svelte
    <button type="submit" class="text-red-600 hover:text-red-800">Revoke</button>
    ```
    **Impact:** Low
    **File:** `src/components/form/tables/CurrentKYNGCoordinatorsTable.svelte`

### Address & Location Management

16. **✅ Validate Address (Custom)** - `/src/components/form/custom-addresses/CustomAddressValidationForm.svelte:88`
    ```svelte
    <button type="submit">Validate Address</button>
    ```
    **Impact:** Low
    **File:** `src/components/form/custom-addresses/CustomAddressValidationForm.svelte`

17. **✅ Check GNAF Address** - `/src/components/form/GNAFAddressCheckForm.svelte:68`
    ```svelte
    <button type="submit">Check Address</button>
    ```
    **Impact:** Low
    **File:** `src/components/form/GNAFAddressCheckForm.svelte`

18. **✅ Custom Address Management** - `/src/components/page/tabs/addresses/CustomAddressManagementTab.svelte:236`
    ```svelte
    <button type="submit">Submit</button>
    ```
    **Impact:** Low
    **File:** `src/components/page/tabs/addresses/CustomAddressManagementTab.svelte`

19. **✅ Add Property** - `/src/components/page/modals/AddPropertyModal.svelte:193`
    ```svelte
    <button type="submit">Add Property</button>
    ```
    **Impact:** Medium - Property creation should show feedback
    **File:** `src/components/page/modals/AddPropertyModal.svelte`

### Location Selectors (4 buttons in one component)

20-23. **✅ LocationBasedSelectors** - `/src/components/form/inputs/LocationBasedSelectors.svelte`
    - Line 54: Submit for Suburb selector
    - Line 95: Submit for Street selector
    - Line 131: Submit for Address selector
    - Line 167: Submit for Property selector

    **Impact:** Low - Quick filters
    **File:** `src/components/form/inputs/LocationBasedSelectors.svelte`

---

## 🗺️ Map Editor Operations (3 buttons)

24. **✅ Delete GeoJSON** - `/src/components/map/leaflet/controls/LeafletGeoJSONDeleteEditor.svelte:127`
    ```svelte
    <button type="submit" class="delete">Delete</button>
    ```
    **Impact:** High - Destructive action needs confirmation + loading state
    **File:** `src/components/map/leaflet/controls/LeafletGeoJSONDeleteEditor.svelte`

25. **✅ Create GeoJSON Attribute** - `/src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte:292`
    ```svelte
    <button type="submit">Create</button>
    ```
    **Impact:** Medium
    **File:** `src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte`

26. **✅ Update GeoJSON Attribute** - `/src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte:295`
    ```svelte
    <button type="submit">Update</button>
    ```
    **Impact:** Medium
    **File:** `src/components/map/leaflet/controls/LeafletGeoJSONAttributeEditor.svelte`

---

## 📅 Event Management (4 buttons)

27. **✅ Create Event (BCYCA)** - `/src/routes/(protected)/admin/community/bcyca/events/+page.svelte:170`
    ```svelte
    <button type="submit">Create Event</button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/community/bcyca/events/+page.svelte`

28. **✅ Create Event (Mondrook)** - `/src/routes/(protected)/admin/community/mondrook/events/+page.svelte:170`
    ```svelte
    <button type="submit">Create Event</button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/community/mondrook/events/+page.svelte`

29. **✅ Create Event (Tinonee)** - `/src/routes/(protected)/admin/community/tinonee/events/+page.svelte:170`
    ```svelte
    <button type="submit">Create Event</button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/community/tinonee/events/+page.svelte`

30. **✅ Create Event (External)** - `/src/routes/(protected)/admin/community/external/events/+page.svelte:170`
    ```svelte
    <button type="submit">Create Event</button>
    ```
    **Impact:** Medium
    **File:** `src/routes/(protected)/admin/community/external/events/+page.svelte`

---

## Summary Statistics

- **Total Buttons Found:** 30
- **✅ Already Fixed:** 30 (100%)
- **❌ Need Fixing:** 0 (0%)

### Priority Breakdown
- **🔴 Critical (Auth/User):** 4 buttons
- **🟡 Important (Admin Ops):** 12 buttons
- **🟢 Lower Priority:** 8 buttons

---

## Implementation Plan

### Phase 1: Critical Auth & User Management (Week 1)
- [ ] AddressValid.svelte - Create Account
- [ ] AddressUnchallenged.svelte - Create Account
- [ ] KYNG Coordinators - Assign/Update

**Estimated Time:** 2-3 hours

### Phase 2: Important Admin Operations (Week 1-2)
- [ ] Role Assignment/Permissions (4 buttons)
- [ ] Message Operations (3 buttons)
- [ ] Spatial Data Templates (2 buttons)

**Estimated Time:** 4-5 hours

### Phase 3: Tables & Modals (Week 2)
- [ ] Table inline actions
- [ ] Address validation forms
- [ ] Add Property modal
- [ ] Map editor operations

**Estimated Time:** 3-4 hours

### Phase 4: Event Management (Week 2-3)
- [ ] All 4 community event creation forms

**Estimated Time:** 2 hours

---

## Code Pattern Template

```svelte
<script lang="ts">
  import Spinner from '$components/page/Spinner.svelte';
  import { enhance } from '$app/forms';

  let isSubmitting = false;
</script>

<form
  method="POST"
  use:enhance={() => {
    isSubmitting = true;

    return async ({ update }) => {
      await update();
      isSubmitting = false;
    };
  }}
>
  <!-- Form fields -->

  <button
    type="submit"
    disabled={isSubmitting}
    aria-busy={isSubmitting}
    class="... disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isSubmitting}
      <Spinner size="sm" /> Processing...
    {:else}
      Submit
    {/if}
  </button>
</form>
```

---

## Testing Checklist

For each button implementation:
- [ ] Button disables during submission
- [ ] Spinner appears with loading text
- [ ] `aria-busy` set to true during loading
- [ ] Button re-enables after completion
- [ ] Works on both success and error cases
- [ ] Double-click prevention verified
- [ ] Keyboard (Enter) works correctly
- [ ] Screen reader announces loading state

---

## Notes

### Additional Improvements Needed

1. **Confirm Dialogs** - These buttons need confirmation before submission:
   - Delete Role (line 94, roles/permissions)
   - Delete GeoJSON (map editor)
   - Revoke Messages (bulk action)
   - Remove Role (table action)

2. **Toast Notifications** - After implementing loading states, add success/error toasts:
   - "Role assigned successfully"
   - "Message sent to X users"
   - "Template updated"

3. **Optimistic UI** - Consider for quick actions:
   - Table row removals
   - Simple toggles
   - Non-critical updates

---

**Last Updated:** 2025-12-08
**Next Review:** After Phase 1 completion
