# Base information
Untuk menghubungkan data antar pesan aplikasi seperti redis, websocket, socketio

Untuk lainnya sedang di kerjakan seperti:
- rabbitmq
- mqtt


## Spesifikasi Minimal "Local"
- Processor : 1 core
- Ram : 256MB

## Spesifikasi Production
- Processor : 2 core -> "Ekslusif"
- Ram : 512MB

- Docker
  ```
  services:
    mas_adapter:
      deploy:
        replicas: 1
        resources:
          limits:
            cpus: '1'
            memory: '128MB'
      command: >
        bash -c "
            tail -f > /dev/null
        "
      expose:
      - 3000
      build: ./image_node
      labels:
        generated: by 8gwifi.org
      volumes:
      - .:/opt/app
      working_dir: /opt/app
      networks: 
        default:
          ipv4_address: 172.18.0.3
          version: '3'
  networks:
    default:
      name: main_network
      external: true
  ```
