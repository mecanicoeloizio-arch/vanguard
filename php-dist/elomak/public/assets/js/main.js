/**
 * EloMak - Main JavaScript Functions (jQuery 3.7 + Helpers)
 * Grupo Eloizio 2026
 */

// Toast notification helper
function showToast(message, type = 'success') {
  let container = $('#toast-container');
  if (container.length === 0) {
    $('body').append('<div id="toast-container"></div>');
    container = $('#toast-container');
  }

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
  const toastClass = type === 'success' ? 'elomak-toast-success' : 'elomak-toast-error';

  const toast = $(`
    <div class="elomak-toast ${toastClass}">
      <i class="fas ${icon}"></i>
      <span>${message}</span>
    </div>
  `);

  container.append(toast);

  setTimeout(() => {
    toast.fadeOut(300, function () {
      $(this).remove();
    });
  }, 4000);
}

// Formatador de placa Mercosul e Antiga [A-Z]{3}[0-9][A-Z0-9][0-9]{2}
function formatarPlaca(input) {
  let val = $(input).val().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (val.length > 7) val = val.substring(0, 7);
  $(input).val(val);
}

// Formatter de Moeda
function formatarMoeda(val) {
  return parseFloat(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

$(document).ready(function () {
  // Mobile drawer toggle
  $('#btn-toggle-menu').on('click', function () {
    $('#mobile-sidebar').toggleClass('hidden');
  });

  // Modal close handlers
  $('[data-close-modal]').on('click', function () {
    $(this).closest('.modal-container').addClass('hidden');
  });

  // Auto-uppercase on inputs with .uppercase-input
  $('.uppercase-input').on('input', function () {
    $(this).val($(this).val().toUpperCase());
  });

  // Consulta de Placa Rápida
  $('.btn-buscar-placa').on('click', function () {
    const targetInput = $(this).data('target');
    const placa = $(targetInput).val().trim();

    if (!placa || placa.length < 7) {
      showToast('Digite uma placa com 7 caracteres válidos.', 'error');
      return;
    }

    const btn = $(this);
    const originalText = btn.html();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Buscando...');

    $.ajax({
      url: '/clientes/consultar-placa',
      method: 'GET',
      data: { placa: placa },
      dataType: 'json',
      success: function (res) {
        btn.html(originalText);
        if (res.success) {
          showToast(`Placa ${res.placa} encontrada: ${res.marca} ${res.modelo} (${res.ano})`, 'success');
          // Preenche campos do formulário se existirem
          $('#input-marca').val(res.marca);
          $('#input-modelo').val(res.modelo);
          $('#input-ano').val(res.ano);
          $('#input-cor').val(res.cor);
        } else {
          showToast(res.error || 'Placa não encontrada.', 'error');
        }
      },
      error: function () {
        btn.html(originalText);
        showToast('Erro ao consultar placa. Verifique sua conexão.', 'error');
      }
    });
  });
});
