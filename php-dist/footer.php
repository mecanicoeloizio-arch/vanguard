<?php
/**
 * Grupo Eloizio - Rodapé Universal Oficial (PHP 8.1+)
 */

declare(strict_types=1);
?>
  </main>

  <!-- Rodapé Institucional -->
  <footer class="bg-slate-950 text-white border-t border-indigo-950/80 pt-12 pb-8 mt-16 shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <!-- Coluna 1 -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              GE
            </div>
            <span class="font-black text-base text-white">Grupo Eloizio</span>
          </div>
          <p class="text-slate-400 leading-relaxed">
            Plataforma educacional integrada para Direção, Professores e Alunos com cursos online, emissão de certificados oficiais, contabilidade digital e assistência técnica mecânica em São Gonçalo - RJ.
          </p>
          <div class="pt-1 text-[11px] text-emerald-400 font-bold">
            ✓ Conforme Lei nº 9.394/96 (Cursos Livres com Certificação)
          </div>
        </div>

        <!-- Coluna 2 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Portais & Ambientes</span>
          <ul class="space-y-1.5 text-slate-400">
            <li><a href="index.php" class="hover:text-white transition">🎓 Vitrine de Cursos Oficiais</a></li>
            <li><a href="aluno.php" class="hover:text-white transition">📚 Portal do Aluno (Boletim & Aulas)</a></li>
            <li><a href="professor.php" class="hover:text-white transition">👨‍🏫 Portal do Professor (Notas & Chamada)</a></li>
            <li><a href="admin.php" class="hover:text-white transition">⚙️ Direção & Gestão Administrativa</a></li>
            <li><a href="propostas.php" class="hover:text-white transition">💼 Central de Propostas Comerciais</a></li>
            <li><a href="validar_certificado.php" class="hover:text-white transition">📜 Validador Oficial de Certificados</a></li>
          </ul>
        </div>

        <!-- Coluna 3 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Serviços & Recursos</span>
          <ul class="space-y-1.5 text-slate-400">
            <li><a href="calendario.php" class="hover:text-white transition">📅 Calendário Acadêmico & Biblioteca</a></li>
            <li><a href="chat.php" class="hover:text-white transition">💬 Chat Interno Institucional</a></li>
            <li><a href="manuais.php" class="hover:text-white transition">📖 Manuais e Guia de Deploy cPanel</a></li>
            <li><span class="text-slate-500">💳 Mercado Pago (PIX com QR Code)</span></li>
            <li><span class="text-slate-500">🤖 Sofia Vanguard (Expert em Cursos & Marketing)</span></li>
          </ul>
        </div>

        <!-- Coluna 4 -->
        <div class="space-y-2">
          <span class="font-bold text-white uppercase tracking-wider block mb-1">Contato & Unidades</span>
          <div class="space-y-1.5 text-slate-400">
            <div>📍 <strong>Sede:</strong> São Gonçalo - RJ</div>
            <div>📱 <strong>WhatsApp Atendimento:</strong> (21) 99613-4073</div>
            <div>📞 <strong>Diretoria Geral (Eloizio):</strong> (21) 98764-8727</div>
            <div>✉️ <strong>E-mail:</strong> mecanicoeloizio@gmail.com</div>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © <?= date('Y') ?> Grupo Eloizio — Todos os direitos reservados. Portal 100% PHP 8, HTML5, CSS3, JS e cURL.
        </div>
        <div class="flex items-center gap-3">
          <span>Segurança SHA-256</span>
          <span>•</span>
          <span>Conforme LGPD</span>
          <span>•</span>
          <span class="text-emerald-400 font-mono">Deploy: public_html pronto</span>
        </div>
      </div>
    </div>
  </footer>

</body>
</html>
