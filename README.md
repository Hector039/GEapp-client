iniciar proyecto con expo con template en blanco:

- npx create-expo-app@latest GEapp --template blank

instalar lint:

- npx expo lint

- npx expo install -- --save-dev prettier eslint-config-prettier eslint-plugin-prettier

instalación Pedómetro:

- npx expo install expo-sensors

Validaciones regex:
Validates a strong password. It must be between 6 and 8 alphanumeric characters, must not contain special characters: /^([a-zA-Z0-9]{6,8})$/;
Validates a strong email: matchs with john-smith@example.com | john.smith@example.com | john_smith@x-ample.com: /^[0-9a-zA-Z]+([0-9a-zA-Z]_[-._+])_[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)_([0-9a-zA-Z]_[.])[a-zA-Z]{2,6}$/;
