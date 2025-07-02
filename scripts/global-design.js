window.initGlobalDesign = function() {
  // Inicializar tabs de código
  initCodeTabs();

  // Botones de copiar código
  initCopyButtons();

  const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
  
      const gridContainer = document.querySelector(".grid-container");
      const loadingContainer = document.querySelector(".loading-container");
      const logoContainer = document.querySelector(".logo-container");
      const infoContainer = document.querySelector(".info-container");
      const priceContainer = document.querySelector(".price-container");
  
      let blocks = []; 
  
      const blockOrder = [
        "block-b",
        "block-c",
        "block-e",
        "block-f",
        "block-a",
        "block-b",
        "block-e",
        "block-b",
        "block-c",
        "block-d",
        "block-a",
        "block-f",
        "block-c",
        "block-d",
        "block-e",
        "block-b",
        "block-c",
        "block-d",
        "block-a",
        "block-f",
        "block-c",
        "block-d",
        "block-e",
      ];
  
      let lastScreenCategory = window.innerWidth <= 1024 ? "small" : "large";
  
      function createGrid(isIntialLoad) {
        if (!gridContainer) return;
  
        if (!(gridContainer instanceof HTMLElement)) {
          return;
        }
        gridContainer.innerHTML = ""; 
  
        const screenWidth = window.innerWidth;
        const screenSize =
          screenWidth <= 430
            ? "extraSmall"
            : screenWidth <= 1024
              ? "medium"
              : "large";
        const columns = screenSize === "large" ? 16 : 8;
        const rows = 25;
        const gridGap = 1;
  
        const cellSize =
          (window.innerWidth - (columns - 1) * gridGap) / columns;
        const gridHeight = cellSize * rows + (rows - 1) * gridGap;
  
        gridContainer.style.width = `${window.innerWidth}px`;
        gridContainer.style.height = `${gridHeight}px`;
        gridContainer.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
  
        
        for (let i = 0; i < rows * columns; i++) {
          const div = document.createElement("div");
          div.className = "grid-item";
          gridContainer.appendChild(div);
        }
  
        updateLoadingContainer(cellSize, gridGap, screenSize);
        updateLogoContainer(cellSize, gridGap, screenSize);
        updateInfoContainer(cellSize, gridGap, screenSize);
        updatePriceContainer(cellSize, gridGap, screenSize);
        
        if (reducedMotion) {
          updateReducedMotionBlocks(
            cellSize,
            gridGap,
            screenSize,
            isIntialLoad,
          );
        } else {
          updateAllBlockPositions();
        }
      }
  
      function updateContainerPosition(
        container,
        cellSize,
        gridGap,
        screenSize,
        positions,
      ) {
        if (!container) return;
  
        const { row, col, width, height } = positions[screenSize];
  
        container.style.left = `${col * (cellSize + gridGap)}px`;
        container.style.top = `${row * (cellSize + gridGap)}px`;
        container.style.width = `${width * (cellSize + gridGap) - 1}px`;
        container.style.minHeight = `${height * (cellSize + gridGap) - 1}px`;
        container.style.height = "auto"; 
      }
  
      function updateLoadingContainer(cellSize, gridGap, screenSize) {
        const containerPositions = {
          extraSmall: { row: 8, col: 1, width: 6, height: 1 },
          medium: { row: 6, col: 1, width: 6, height: 1 },
          large: { row: 2, col: 10, width: 4, height: 1 },
        };
        updateContainerPosition(
          loadingContainer,
          cellSize,
          gridGap,
          screenSize,
          containerPositions,
        );
      }
  
      function updateLogoContainer(cellSize, gridGap, screenSize) {
        const containerPositions = {
          extraSmall: { row: 2, col: 1, width: 6, height: 3 },
          medium: { row: 1, col: 1, width: 6, height: 2 },
          large: { row: 2, col: 2, width: 5, height: 2 },
        };
        updateContainerPosition(
          logoContainer,
          cellSize,
          gridGap,
          screenSize,
          containerPositions,
        );
      }
  
      function updateInfoContainer(cellSize, gridGap, screenSize) {
        const containerPositions = {
          extraSmall: { row: 10, col: 1, width: 6, height: 16 }, // Debajo del logo en móvil
          medium: { row: 8, col: 1, width: 6, height: 16 }, // Debajo del logo en tablet
          large: { row: 9, col: 2, width: 12, height: 16 } // Debajo del logo en desktop
        };
        updateContainerPosition(
          infoContainer,
          cellSize,
          gridGap,
          screenSize,
          containerPositions
        );
      }
  
      function updatePriceContainer(cellSize, gridGap, screenSize) {
          const containerPositions = {
              extraSmall: { row: 2, col: 0, width: 8, height: 18 },
              medium: { row: 1, col: 0, width: 8, height: 18 },
              large: { row: 2, col: 2, width: 12, height: 16 }
          };
          updateContainerPosition(
              priceContainer,
              cellSize,
              gridGap,
              screenSize,
              containerPositions
          );
      }
  
      function updateReducedMotionBlocks(
        cellSize,
        gridGap,
        screenSize,
        isIntialLoad,
      ) {
        blocks.forEach((block) => block.remove());
        blocks = []; 
  
        const rmBlockPositions = [
          { blockId: "block-c", row: 0, col: 3 },
          { blockId: "block-d", row: 1, col: 7 },
          { blockId: "block-a", row: 2, col: 13 },
          { blockId: "block-f", row: 3, col: 13 },
          { blockId: "block-d", row: 5, col: 7 },
          { blockId: "block-e", row: 6, col: 1 },
          { blockId: "block-b", row: 7, col: 9 },
          { blockId: "block-e", row: 7, col: 10 },
          { blockId: "block-f", row: 9, col: 3 },
          { blockId: "block-c", row: 9, col: 4 },
        ];
  
        const rmBlockPositionsSmall = [
          { blockId: "block-c", row: 0, col: 3 },
          { blockId: "block-d", row: 2, col: 7 },
          { blockId: "block-b", row: 3, col: 7 },
          { blockId: "block-e", row: 6, col: 0 },
          { blockId: "block-f", row: 7, col: 0 },
          { blockId: "block-a", row: 8, col: 5 },
          { blockId: "block-a", row: 10, col: 1 },
          { blockId: "block-e", row: 13, col: 5 },
          { blockId: "block-d", row: 16, col: 5 },
          { blockId: "block-f", row: 16, col: 7 },
        ];
  
        const blockPositions =
          screenSize === "large" ? rmBlockPositions : rmBlockPositionsSmall;
  
        blockPositions.forEach((blockPosition) => {
          const blockElement = document.getElementById(blockPosition.blockId);
          if (!blockElement) return;
          const block = blockElement.cloneNode(true);
          if (!(block instanceof HTMLImageElement)) return;
          document.body.appendChild(block);
          blocks.push(block);
  
          block.style.left = `${blockPosition.col * (cellSize + gridGap)}px`;
          block.style.top = `${blockPosition.row * (cellSize + gridGap)}px`;
          block.style.width = `${cellSize}px`;
          block.style.height = `${cellSize}px`;
  
          block.classList.add("rm-block");
  
          if (isIntialLoad) {
            block.classList.add("hidden");
          }
        });
      }
  
      function getAnimationDuration() {
        const screenWidth = window.innerWidth;
  
        const minWidth = 320;
        const midWidth = 1024;
        const maxWidth = 1920;
  
        if (screenWidth <= midWidth) {
          const ratio = (screenWidth - minWidth) / (midWidth - minWidth);
          return 1.7 + ratio * (2.2 - 1.7);
        } else {
          const ratio = (screenWidth - midWidth) / (maxWidth - midWidth);
          return 3 + ratio * (4 - 3);
        }
      }
  
      let pendingDuration = null;
  
      function startBlocks() {
        blocks = []; 
        const bezierCurve = "cubic-bezier(.2,0,.93,1)";
        const baseDuration = getAnimationDuration();
  
        console.log("Initial Animation duration:", baseDuration);
        blockOrder.forEach((blockId, rowIndex) => {
          const blockElement = document.getElementById(blockId);
          if (!blockElement) return;
          const block = blockElement.cloneNode(true);
          if (!(block instanceof HTMLImageElement)) return;
  
          block.classList.add("block");
          block.alt = "Moving SVG Block";
  
          
          const delay = Math.random() * baseDuration + 0;
  
          block.style.left = "-15vw";
          block.style.animation = `slide ${baseDuration}s ${bezierCurve} ${delay}s forwards infinite`;
  
          document.body.appendChild(block);
          blocks.push(block);
  
          updateBlockPosition(block, rowIndex);
  
          
          
          block.addEventListener('animationiteration', () => {
            if (pendingDuration !== null) {
              
              block.style.animationIterationCount = '1';
  
              const handleEnd = () => {
                block.removeEventListener('animationend', handleEnd);
                block.style.animation = 'none';
                block.style.left = '-15vw';
  
                void block.offsetWidth;
                const delay = Math.random() * pendingDuration + 0;
  
                
                console.log("Updated Animation duration:", pendingDuration);
                const newAnimation = `slide ${pendingDuration}s ${bezierCurve} ${delay}s forwards infinite`;
                block.style.animation = newAnimation;
  
              };
  
              block.addEventListener('animationend', handleEnd);
  
            }
          });
  
        });
      }
  
      function updateBlockPosition(block, rowNumber) {
        if (!gridContainer) return;
  
        const rows = 25;
        const gridGap = 1;
        const gridRect = gridContainer.getBoundingClientRect();
        const rowHeight = (gridRect.height - (rows - 1) * gridGap) / rows;
  
        let topPosition = gridRect.top + rowNumber * (rowHeight + gridGap);
        block.style.position = "absolute";
        block.style.top = `${topPosition}px`;
        block.style.height = `${rowHeight}px`;
        block.style.display = "block";
      }
  
      function updateAllBlockPositions() {
        blocks.forEach((block, index) => {
          updateBlockPosition(block, index);
        });
      }
  
      createGrid(true);
  
      // Mueve aquí el código que estaba en DOMContentLoaded:
      logoContainer?.classList.add("fade-in");
      loadingContainer?.classList.add("fade-in");
      infoContainer?.classList.add("fade-in");
  
      setTimeout(() => {
        gridContainer?.classList.add("fade-in");
      }, 1000);
  
      if (reducedMotion) {
        setTimeout(() => {
          document.querySelectorAll(".rm-block").forEach((block) => {
            block.classList.add("fade-in");
          });
        }, 1100);
      } else {
        setTimeout(() => {
          startBlocks();
        }, 1200);
      }
  
      function resetBlocks() {
        blocks.forEach((block) => {
          block.remove();
        });
        blocks = [];
      }
  
      window.addEventListener("resize", () => {
        if (!reducedMotion) {
          const newCategory = window.innerWidth <= 1024 ? "small" : "large";
  
          
          if (newCategory !== lastScreenCategory) {
            lastScreenCategory = newCategory;
            resetBlocks();
            startBlocks();
          }
          createGrid();
          
          const newDuration = getAnimationDuration();
          pendingDuration = newDuration;
          updateAllBlockPositions();
        }
      }
      );
  
      function initCodeTabs() {
        const tabButtons = document.querySelectorAll('.code-tab-btn');
        const tabContents = document.querySelectorAll('.code-tab-content');
        
        tabButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al botón y contenido seleccionado
            button.classList.add('active');
            tabContents[index].classList.add('active');
          });
        });
        
        // Activar el primer tab por defecto
        if (tabButtons.length > 0) {
          tabButtons[0].click();
        }
      }
  
      /**
       * Inicializar botones de copiar código
       */
      function initCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
          button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-tab-content').querySelector('code');
            const textToCopy = codeBlock.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
              // Cambiar temporalmente el ícono del botón
              const originalHTML = this.innerHTML;
              this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Copied!
              `;
              
              // Restaurar después de 2 segundos
              setTimeout(() => {
                this.innerHTML = originalHTML;
              }, 2000);
            }).catch(err => {
              console.error('Error al copiar texto: ', err);
            });
          });
        });
      }
  }