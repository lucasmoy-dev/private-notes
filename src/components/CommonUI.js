export function getCommonUITemplate() {
    return `
    <!-- Prompt Modal -->
    <div id="prompt-modal" class="fixed inset-0 z-[200] hidden">
        <div class="absolute inset-0 bg-background/90 backdrop-blur-xl"></div>
        <div class="dialog-content max-w-sm p-6 space-y-6">
            <div class="space-y-2">
                <h2 id="prompt-title" class="text-xl font-bold">Seguridad</h2>
                <p id="prompt-desc" class="text-sm text-muted-foreground leading-relaxed">Ingresa la contraseña para continuar</p>
            </div>
            <div class="space-y-4">
                <div class="relative group">
                    <input type="password" id="prompt-input" placeholder="Tu contraseña"
                        class="h-11 w-full text-center tracking-widest outline-none pr-12 bg-muted/30 border-transparent focus:border-primary/30 transition-all rounded-lg">
                    <button type="button"
                        class="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground toggle-pass"
                        data-target="prompt-input">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="flex gap-3 pt-2">
                    <button id="prompt-cancel" class="btn-shad btn-shad-outline flex-1 h-11">Cancelar</button>
                    <button id="prompt-confirm" class="btn-shad btn-shad-primary flex-1 h-11 font-bold">Confirmar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast">
        <div class="border">
            ¡Acción completada!
        </div>
    </div>`;
}
