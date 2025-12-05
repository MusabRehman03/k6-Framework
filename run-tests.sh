#!/bin/bash
# k6 Framework Test Runner
# Helper script to run k6 tests with common options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if k6 is installed
check_k6() {
    if ! command -v k6 &> /dev/null; then
        echo -e "${RED}Error: k6 is not installed${NC}"
        echo "Please install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/"
        exit 1
    fi
    echo -e "${GREEN}✓ k6 is installed${NC}"
}

# Show help
show_help() {
    echo -e "${BLUE}k6 Framework Test Runner${NC}"
    echo ""
    echo "Usage: ./run-tests.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  smoke         Run smoke tests"
    echo "  load          Run load tests"
    echo "  stress        Run stress tests"
    echo "  auth          Run authentication scenario"
    echo "  data          Run data-driven test"
    echo "  journey       Run e-commerce journey test"
    echo "  all           Run all tests"
    echo "  report        Open the latest HTML report"
    echo "  clean         Clean up reports directory"
    echo "  help          Show this help message"
    echo ""
    echo "Options:"
    echo "  --vus N       Number of virtual users (default: from test)"
    echo "  --duration D  Test duration (default: from test)"
    echo "  --env ENV     Environment: dev, staging, prod (default: dev)"
    echo "  --url URL     Base URL override"
    echo ""
    echo "Examples:"
    echo "  ./run-tests.sh smoke"
    echo "  ./run-tests.sh load --vus 50 --duration 5m"
    echo "  ./run-tests.sh smoke --env staging --url https://api.staging.example.com"
    echo ""
}

# Run smoke test
run_smoke() {
    echo -e "${BLUE}Running smoke test...${NC}"
    k6 run $@ tests/smoke/basic-http-test.js
}

# Run load test
run_load() {
    echo -e "${BLUE}Running load test...${NC}"
    k6 run $@ tests/load/advanced-load-test.js
}

# Run stress test
run_stress() {
    echo -e "${BLUE}Running stress test...${NC}"
    k6 run $@ tests/stress/stress-test.js
}

# Run auth scenario
run_auth() {
    echo -e "${BLUE}Running authentication scenario...${NC}"
    k6 run $@ tests/scenarios/auth-example.js
}

# Run data-driven test
run_data() {
    echo -e "${BLUE}Running data-driven test...${NC}"
    k6 run $@ tests/scenarios/data-driven-test.js
}

# Run e-commerce journey
run_journey() {
    echo -e "${BLUE}Running e-commerce journey test...${NC}"
    k6 run $@ tests/scenarios/ecommerce-journey.js
}

# Run all tests
run_all() {
    echo -e "${BLUE}Running all tests...${NC}"
    run_smoke
    echo ""
    run_load
    echo ""
    run_stress
    echo ""
    echo -e "${GREEN}All tests completed!${NC}"
}

# Open report
open_report() {
    if [ -f "reports/summary.html" ]; then
        echo -e "${BLUE}Opening HTML report...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open reports/summary.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open reports/summary.html
        else
            echo "Please open reports/summary.html in your browser"
        fi
    else
        echo -e "${YELLOW}No report found. Run a test first.${NC}"
    fi
}

# Clean reports
clean_reports() {
    echo -e "${BLUE}Cleaning reports directory...${NC}"
    rm -f reports/*.html reports/*.json
    echo -e "${GREEN}Reports cleaned${NC}"
}

# Main script
check_k6

# Parse command
COMMAND=${1:-help}
shift || true

# Parse options
EXTRA_ARGS=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --vus)
            EXTRA_ARGS="$EXTRA_ARGS --vus $2"
            shift 2
            ;;
        --duration)
            EXTRA_ARGS="$EXTRA_ARGS --duration $2"
            shift 2
            ;;
        --env)
            EXTRA_ARGS="$EXTRA_ARGS -e ENVIRONMENT=$2"
            shift 2
            ;;
        --url)
            EXTRA_ARGS="$EXTRA_ARGS -e BASE_URL=$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Execute command
case $COMMAND in
    smoke)
        run_smoke $EXTRA_ARGS
        ;;
    load)
        run_load $EXTRA_ARGS
        ;;
    stress)
        run_stress $EXTRA_ARGS
        ;;
    auth)
        run_auth $EXTRA_ARGS
        ;;
    data)
        run_data $EXTRA_ARGS
        ;;
    journey)
        run_journey $EXTRA_ARGS
        ;;
    all)
        run_all
        ;;
    report)
        open_report
        ;;
    clean)
        clean_reports
        ;;
    help|*)
        show_help
        ;;
esac
