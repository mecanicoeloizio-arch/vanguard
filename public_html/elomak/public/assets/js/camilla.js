/**
 * EloMak - Fluxo de Autenticação Exclusivo via WhatsApp com a Camilla
 * Grupo Eloizio 2026
 */

$(document).ready(function () {
  $('#form-login-whatsapp').on('submit', function (e) {
    e.preventDefault();

    const inputWhatsapp = $('#whatsapp_input').val().trim();
    if (!inputWhatsapp || inputWhatsapp.length < 10) {
      showToast('Por favor, informe seu WhatsApp com DDD completo.', 'error');
      return;
    }

    const btn = $('#btn-submit-whatsapp');
    const originalHtml = btn.html();

    btn.prop('disabled', true).html(`
      <i class="fas fa-circle-notch fa-spin"></i>
      <span>Camilla conectando via Hub Central...</span>
    `);

    $('#feedback-container').addClass('hidden');

    $.ajax({
      url: '/camilla/verificar',
      method: 'POST',
      data: { whatsapp: inputWhatsapp },
      dataType: 'json',
      success: function (res) {
        btn.prop('disabled', false).html(originalHtml);

        if (res.success) {
          showToast(res.feedback || 'Mensagem enviada no seu WhatsApp!', 'success');

          // Exibe o painel interativo de acesso com o link gerado
          $('#feedback-container').removeClass('hidden');
          $('#feedback-nome').text(res.nome || 'Visitante');
          $('#feedback-status').text(res.status === 'existente' ? 'Cliente/Oficina Cadastrada' : 'Novo Atendimento');
          $('#feedback-link-btn').attr('href', res.link_acesso);
          $('#feedback-link-url').text(res.link_acesso);
          $('#feedback-mensagem').text(res.mensagem_enviada);

          // Scroll suave até o feedback
          $('html, body').animate({
            scrollTop: $('#feedback-container').offset().top - 40
          }, 400);

        } else {
          showToast(res.error || 'Não foi possível verificar o número.', 'error');
        }
      },
      error: function (xhr) {
        btn.prop('disabled', false).html(originalHtml);
        showToast('Erro ao processar requisição. Verifique sua conexão.', 'error');
      }
    });
  });
});
