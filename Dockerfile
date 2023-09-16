FROM node:16.13.0

# Add app
COPY . ./ntechlab-mock
WORKDIR /ntechlab-mock

# Set the default command to run on boot
CMD ["node", "dist/index.js"]
