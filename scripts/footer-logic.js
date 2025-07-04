(function() {
        var footer = document.getElementById('footerFlotante');
        var toggle = footer.querySelector('.footer-toggle');
        function setClosed(closed) {
          if (closed) {
            footer.classList.add('closed');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            footer.classList.remove('closed');
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
        // Start closed on mobile
        function checkMobile() {
          if (window.innerWidth <= 700) {
            setClosed(true);
          } else {
            setClosed(false);
          }
        }
        toggle.addEventListener('click', function(e) {
          e.stopPropagation();
          var isClosed = footer.classList.contains('closed');
          setClosed(!isClosed);
        });
        window.addEventListener('resize', checkMobile);
        document.addEventListener('DOMContentLoaded', checkMobile);
      })();