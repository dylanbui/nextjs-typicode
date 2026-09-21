#!/usr/bin/env bash

# ==============================================================================
# TYPI-CODE SERVER CONTROL SCRIPT (Next.js Monorepo)
# ==============================================================================
# Usage:
#   ./server.sh start       : Start dev server in foreground (default)
#   ./server.sh start -d    : Start dev server in background (daemon)
#   ./server.sh stop        : Stop running server on port 3000
#   ./server.sh restart     : Clean kill port 3000 and restart dev server
#   ./server.sh status      : Check if server is running
#   ./server.sh logs        : View real-time server logs (if started in background)
#   ./server.sh build       : Run production typecheck & build
#   ./server.sh clean       : Clear .next cache & restart
# ==============================================================================

PORT=3000
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/server.log"
PID_FILE="$LOG_DIR/server.pid"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

mkdir -p "$LOG_DIR"

get_port_pids() {
    lsof -ti :$PORT 2>/dev/null
}

kill_port() {
    local pids=$(get_port_pids)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}⚡ Terminating process(es) on port $PORT (PID: $pids)...${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 1
    fi

    if [ -f "$PID_FILE" ]; then
        local saved_pid=$(cat "$PID_FILE" 2>/dev/null)
        if [ -n "$saved_pid" ]; then
            kill -9 "$saved_pid" 2>/dev/null
        fi
        rm -f "$PID_FILE"
    fi
}

is_server_running() {
    local pids=$(get_port_pids)
    [ -n "$pids" ]
}

status_server() {
    local pids=$(get_port_pids)
    if [ -n "$pids" ]; then
        echo -e "${GREEN}● Server is RUNNING on port $PORT${NC} (PID: ${BOLD}$pids${NC})"
        echo -e "  🌐 Local URL: ${CYAN}http://localhost:$PORT${NC}"
    else
        echo -e "${YELLOW}○ Server is STOPPED (Port $PORT is free).${NC}"
    fi
    return 0
}

start_server() {
    local daemon_mode=$1
    local pids=$(get_port_pids)

    if [ -n "$pids" ]; then
        echo -e "${YELLOW}⚠️  Port $PORT is already in use by PID(s): $pids.${NC}"
        echo -e "Use ${CYAN}./server.sh restart${NC} or ${CYAN}./server.sh stop${NC} first."
        exit 1
    fi

    if [ "$daemon_mode" == "-d" ] || [ "$daemon_mode" == "--daemon" ]; then
        echo -e "${CYAN}🚀 Starting Next.js server in BACKGROUND on port $PORT...${NC}"
        npm run dev --workspace=web > "$LOG_FILE" 2>&1 &
        local new_pid=$!
        echo "$new_pid" > "$PID_FILE"
        sleep 2
        
        if is_server_running; then
            echo -e "${GREEN}✅ Server started successfully!${NC}"
            echo -e "  🌐 URL:  ${CYAN}http://localhost:$PORT${NC}"
            echo -e "  📜 Logs: ${YELLOW}./server.sh logs${NC} (or tail -f $LOG_FILE)"
        else
            echo -e "${RED}❌ Failed to start server. Check logs:${NC} cat $LOG_FILE"
        fi
    else
        echo -e "${CYAN}🚀 Starting Next.js server on http://localhost:$PORT...${NC}"
        echo -e "  📜 All console output is being recorded to: ${YELLOW}$LOG_FILE${NC}"
        echo -e "  (Press ${BOLD}Ctrl+C${NC} to stop server)\n"
        npm run dev --workspace=web 2>&1 | tee "$LOG_FILE"
    fi
}

stop_server() {
    echo -e "${CYAN}🛑 Stopping server on port $PORT...${NC}"
    kill_port
    echo -e "${GREEN}✅ Server stopped.${NC}"
}

restart_server() {
    local daemon_mode=$1
    echo -e "${YELLOW}🔄 Restarting server...${NC}"
    kill_port
    start_server "$daemon_mode"
}

clean_cache() {
    echo -e "${YELLOW}🧹 Cleaning Next.js cache (.next)...${NC}"
    rm -rf apps/web/.next
    rm -rf .turbo
    echo -e "${GREEN}✅ Cache cleaned.${NC}"
    restart_server "$1"
}

show_logs() {
    if [ ! -f "$LOG_FILE" ]; then
        touch "$LOG_FILE"
    fi
    echo -e "${CYAN}📜 Streaming logs from $LOG_FILE (Press Ctrl+C to exit)...${NC}"
    tail -n 50 -f "$LOG_FILE"
}

build_project() {
    echo -e "${CYAN}🏗️  Running build check for workspace: web...${NC}"
    npm run build --workspace=web
}

# Main command dispatcher
case "$1" in
    start)
        start_server "$2"
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server "$2"
        ;;
    status)
        status_server
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_cache "$2"
        ;;
    build)
        build_project
        ;;
    *)
        echo -e "${BOLD}TYPI-CODE SERVER MANAGER${NC}"
        echo -e "Usage: ${CYAN}./server.sh <command>${NC}"
        echo ""
        echo "Commands:"
        echo -e "  ${GREEN}start${NC}         Start server in foreground (interactive, Ctrl+C to exit)"
        echo -e "  ${GREEN}start -d${NC}      Start server in background (daemon mode)"
        echo -e "  ${GREEN}stop${NC}          Kill and stop server running on port $PORT"
        echo -e "  ${GREEN}restart${NC}       Kill port $PORT and start server again"
        echo -e "  ${GREEN}restart -d${NC}    Restart server in background"
        echo -e "  ${GREEN}status${NC}        Check if server is currently running on port $PORT"
        echo -e "  ${GREEN}logs${NC}          View live log stream"
        echo -e "  ${GREEN}clean${NC}         Delete .next cache and restart fresh"
        echo -e "  ${GREEN}build${NC}         Validate build compilation without starting dev"
        echo ""
        ;;
esac
