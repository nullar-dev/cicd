#!/bin/sh
# ═══════════════════════════════════════════════════════════════
#  ⚡ nullar pre-commit-hook setup ⚡
# ═══════════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ⚡ Nullar Pre-Commit Hook Setup ⚡"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo " ⚡ Setting up pre-commit hook..."
echo ""

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HOOK_SOURCE="$PROJECT_ROOT/.git/hooks/pre-commit"
HOOK_TARGET="$PROJECT_ROOT/.git/hooks/pre-commit"

# Create .git/hooks directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/.git/hooks"

# Copy the hook
if [ -f "$HOOK_SOURCE" ]; then
    cp "$HOOK_SOURCE" "$HOOK_TARGET"
    chmod +x "$HOOK_TARGET"
    echo " ✅ Pre-commit hook installed!"
    echo ""
    echo " The hook will now run these checks before every commit:"
    echo "   • ESLint"
    echo "   • Prettier"
    echo "   • TypeScript"
    echo "   • Tests"
    echo ""
else
    echo " ❌ Error: Could not find pre-commit hook file"
    exit 1
fi
