# Base information
Artywiz Broadcast service untuk handle long process yang enggak bisa di tunggu lama

# Spesifikasi Minimal "Local"
Processor : 1 core
Ram : 256MB

# Spesifikasi Production
Processor : 2 core -> "Ekslusif"
Ram : 512MB

# Langkah install 
- Desktop
  - yarn install
  - ubah env port 3000 -> "Sesuaikan"
  - npm run dev -> "Compile"
  - npm run start-dev -> "Running"

- Docker
  ```
  database:
  ... config
  app: 
  ...config
  # Gabung config ini ke docker-compose artywiz
  broadcast_service:
    image : artywiz_broadcast_service
    build: ../artywiz_broadcast_service/image_node
    working_dir : '/opt/app'
    command: >
      bash -c "
        tail -f > /dev/null"
    deploy:
      resources:
        limits:
          cpus: 2
          memory: 256M
    #expose: [3001]
    ports: 
      - "3002:3001"
    volumes:
      - "../artywiz_broadcast_service:/opt/app"
  ```
