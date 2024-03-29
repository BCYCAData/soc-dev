Detect when the value of an input field has been changed by the user:
```<script>
  // Custom action to track input changes
  function trackInputChange(node) {
    node.addEventListener('input', () => {
      console.log('Input value changed:', node.value);
    });
  }
</script>

<input
  type="text"
  placeholder="Type something..."
  use:trackInputChange
/>```

Custom action to log both the state (checked or unchecked) and the current value of the checkbox:
```<script>
  // Custom action to track checkbox changes
  function trackCheckboxChange(node) {
    node.addEventListener('change', () => {
      console.log('Checkbox state changed:', node.checked);
      console.log('Checkbox value:', node.value); // Added line
    });
  }
</script>

<label>
  <input type="checkbox" use:trackCheckboxChange />
  Check me
</label>```

Log the selected value of radio buttons:
```<script>
  let selectedOption = '';

  // Custom action to track radio button changes
  function trackRadioChange(node) {
    node.addEventListener('change', () => {
      selectedOption = node.value;
      console.log('Selected option:', selectedOption);
    });
  }
</script>

<label>
  <input type="radio" value="option1" name="radioGroup" use:trackRadioChange />
  Option 1
</label>
<label>
  <input type="radio" value="option2" name="radioGroup" use:trackRadioChange />
  Option 2
</label>```

To modify the trackInputChange custom action so that it applies to checkboxes and radio buttons in addition to text inputs, we can enhance the action to handle different input types.
```<script>
  // Custom action to track input changes for text inputs, checkboxes, and radio buttons
  function trackInputChange(node) {
    node.addEventListener('input', () => {
      console.log('Input value changed:', node.value);
    });

    // For checkboxes and radio buttons, listen for the "change" event
    if (node.type === 'checkbox' || node.type === 'radio') {
      node.addEventListener('change', () => {
        console.log('Checkbox or radio state changed:', node.checked);
      });
    }
  }
</script>

<form use:trackInputChange>
  <input type="text" placeholder="Name" />
  <input type="email" placeholder="Email" />
  <input type="checkbox" /> Check me
  <input type="radio" name="gender" value="male" /> Male
  <input type="radio" name="gender" value="female" /> Female
  <!-- Add more input fields here -->
</form>```

