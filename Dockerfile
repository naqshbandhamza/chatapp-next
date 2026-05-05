# Step 1: Use an official lightweight Node.js image with Alpine Linux
# Alpine makes the image smaller and faster
FROM node:22-alpine AS builder

# Step 2: Set the working directory inside the container
# All following commands will run from this directory
WORKDIR /app

# Step 3: Copy only the package files first
# This helps leverage Docker layer caching, so npm install won't re-run unless dependencies change
COPY package.json package-lock.json* ./

# Step 4: Install project dependencies
# This installs both production and dev dependencies needed for building the app
RUN npm install

# Step 5: Copy the rest of the app's source code into the container
# Includes pages, components, styles, etc.
COPY . .

# Step 6: Build the Next.js app
# This generates the `.next` folder with all compiled assets
RUN npm run build

# ----------------------------------------------
# Now we move to a second "runner" stage.
# This keeps the final image small and clean, without unnecessary build tools.
# ----------------------------------------------

# Step 7: Use the same lightweight Node.js image for running the app
FROM node:22-alpine AS runner

# Step 8: Set the working directory again
WORKDIR /app

# Step 9: Set environment to production
ENV NODE_ENV=production

# Step 10: Copy only the necessary files from the builder stage
# - Compiled `.next` build
# - `public` assets like images
# - `node_modules` for server-side packages
# - `package.json` for reference
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Step 11: Expose port 3000 (Next.js default)
EXPOSE 3000

# Step 12: Start the Next.js app using the default start script
CMD ["npm", "start"]
