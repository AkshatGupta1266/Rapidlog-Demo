document.addEventListener('DOMContentLoaded', () => {
  // Staggered fade-up animation initialization
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });

  // Agent Bar interaction
  const agentBar = document.querySelector('.agent-bar input');
  if (agentBar) {
    agentBar.addEventListener('focus', () => {
      document.body.style.backgroundColor = '#0a0a0c'; // Dim background slightly
    });
    agentBar.addEventListener('blur', () => {
      document.body.style.backgroundColor = ''; // Restore
    });
  }

  // Modals / Overlays
  const overlay = document.getElementById('epicStoryOverlay');
  const openBtns = document.querySelectorAll('[data-overlay-target]');
  const closeBtns = document.querySelectorAll('.close-btn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-overlay-target');
      const targetOverlay = document.getElementById(targetId);
      if (targetOverlay) {
        targetOverlay.classList.add('active');
        // Elastic pop effect logic (handled mainly in CSS, but can add class)
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const overlay = e.target.closest('.overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Close overlay on outside click
  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Interactive buttons feedback
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.96)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // Threat Accordion Logic
  const threatHeaders = document.querySelectorAll('.threat-header');
  threatHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.closest('.threat-item');
      
      // Close all others (optional: depends on preferred UX, usually good to close others)
      document.querySelectorAll('.threat-item.expanded').forEach(item => {
        if(item !== parentItem) item.classList.remove('expanded');
      });

      parentItem.classList.toggle('expanded');
    });
    
    // Accessibility for keyboard
    header.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Interactive Pills / Filter Chips logic
  const interactivePills = document.querySelectorAll('.interactive-pill');
  interactivePills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Create a soft ripple effect purely through class toggle if needed,
      // but CSS :active handles it natively. We just toggle the active state.
      
      // If it's a domain filter group (the ones under "Filters")
      if (pill.parentElement.classList.contains('mb-4')) {
        pill.parentElement.querySelectorAll('.interactive-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      } else {
        // Quick select items can be multi-select
        pill.classList.toggle('active');
      }
    });

    // Keyboard accessibility
    pill.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pill.click();
      }
    });
  });

  // Add Market Logic
  const addMarketBtns = document.querySelectorAll('.add-market-btn');
  addMarketBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const marketText = btn.getAttribute('data-market');
      const marketHealthList = document.getElementById('market-health-list');
      
      // Create new badge
      const newBadge = document.createElement('div');
      newBadge.className = 'badge badge-neutral fade-up';
      
      // Parse the emoji and text
      const parts = marketText.split(' ');
      const emoji = parts[0];
      const text = parts.slice(1).join(' ');
      
      newBadge.innerHTML = `<span style="margin-right: 4px;">${emoji}</span> ${text}<span class="remove-badge" title="Remove">&times;</span>`;
      newBadge.style.animationDuration = '0.3s';
      newBadge.setAttribute('data-market-source', marketText);
      
      // Insert before the dropdown container
      const dropdownContainer = marketHealthList.querySelector('.dropdown');
      marketHealthList.insertBefore(newBadge, dropdownContainer);
      
      // Hide the clicked option
      btn.style.display = 'none';
      
      // If all options are hidden, hide the dropdown button entirely
      const visibleOptions = Array.from(addMarketBtns).filter(b => b.style.display !== 'none');
      if (visibleOptions.length === 0) {
        dropdownContainer.style.display = 'none';
      }
      
      updateMarketBadgesRemovability();
    });
  });

  function updateMarketBadgesRemovability() {
    const list = document.getElementById('market-health-list');
    if (!list) return;
    const badges = list.querySelectorAll('.badge');
    if (badges.length <= 1) {
      badges.forEach(b => b.classList.add('cannot-remove'));
    } else {
      badges.forEach(b => b.classList.remove('cannot-remove'));
    }
  }
  // Initialize
  updateMarketBadgesRemovability();

  // Remove Badge Logic
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-badge')) {
      const badge = e.target.closest('.badge');
      if (badge) {
        // If it was added from the dropdown, put it back
        const marketSource = badge.getAttribute('data-market-source');
        if (marketSource) {
          const addMarketBtns = document.querySelectorAll('.add-market-btn');
          addMarketBtns.forEach(btn => {
            if (btn.getAttribute('data-market') === marketSource) {
              btn.style.display = 'block';
              // Make sure the dropdown container is visible again
              const dropdownContainer = document.querySelector('#market-health-list .dropdown');
              if (dropdownContainer) {
                dropdownContainer.style.display = 'block';
              }
            }
          });
        }
        
        // Remove the badge from the DOM
        badge.remove();
        updateMarketBadgesRemovability();
      }
    }
  });

  // Standard Dropdown selection logic
  const dropdownItems = document.querySelectorAll('.dropdown-item:not(.add-market-btn)');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const menu = item.closest('.dropdown-menu');
      const btn = menu.previousElementSibling;
      
      if (btn && btn.classList.contains('dropdown-btn')) {
        // Remove active class from all items in this menu
        menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Keep the SVG arrow but change the text
        const svg = btn.querySelector('svg');
        btn.textContent = item.textContent + ' ';
        if (svg) {
          btn.appendChild(svg);
        }
        
        // Force the dropdown to close momentarily so it doesn't stay stuck open
        menu.style.display = 'none';
        setTimeout(() => {
          menu.style.display = '';
        }, 100);
      }
    });
  });

  // Tree View Toggle Logic
  const treeRows = document.querySelectorAll('.tree-row');
  treeRows.forEach(row => {
    row.addEventListener('click', (e) => {
      const li = row.closest('li');
      let ul = null;
      for (let i = 0; i < li.children.length; i++) {
        if (li.children[i].tagName === 'UL') {
          ul = li.children[i];
          break;
        }
      }
      
      if (ul) {
        const isCollapsed = li.classList.contains('collapsed');
        const toggle = row.querySelector('.tree-toggle');
        
        if (isCollapsed) {
          // Opening
          li.classList.remove('collapsed');
          if (toggle) toggle.textContent = '▼';
          
          ul.style.display = 'block';
          ul.style.height = 'auto';
          const height = ul.scrollHeight;
          
          ul.style.height = '0px';
          ul.style.overflow = 'hidden';
          ul.style.opacity = '0';
          
          // Force reflow
          ul.offsetHeight;
          
          ul.style.transition = 'height 0.2s ease-in-out, opacity 0.2s ease-in-out';
          ul.style.height = height + 'px';
          ul.style.opacity = '1';
          
          setTimeout(() => {
            ul.style.height = '';
            ul.style.overflow = '';
            ul.style.transition = '';
          }, 200);
          
        } else {
          // Collapsing
          const height = ul.scrollHeight;
          ul.style.height = height + 'px';
          ul.style.overflow = 'hidden';
          ul.style.opacity = '1';
          ul.style.transition = 'height 0.2s ease-in-out, opacity 0.2s ease-in-out';
          
          // Force reflow
          ul.offsetHeight;
          
          li.classList.add('collapsed');
          if (toggle) toggle.textContent = '▶';
          
          ul.style.height = '0px';
          ul.style.opacity = '0';
          
          setTimeout(() => {
            ul.style.transition = '';
            ul.style.height = '';
            ul.style.overflow = '';
            ul.style.opacity = '';
          }, 200);
        }
      }
    });
  });
});
