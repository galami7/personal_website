document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll('.acc-item');
  const avatarA = document.getElementById('avatar-img-a');
  const avatarB = document.getElementById('avatar-img-b');

  const avatarMap = {
    default: 'assets/avatar_default.jpg',
    about: 'assets/avatar_about.jpg',
    education: 'assets/avatar_education.jpg',
    experience: 'assets/avatar_experience.jpg',
    passions: 'assets/avatar_passions.jpg'
  };

  Object.values(avatarMap).forEach(function (src) {
    const img = new Image();
    img.src = src;
  });

  let activeSection = 'default';
  let visibleAvatar = avatarA;
  let hiddenAvatar = avatarB;
  let isTransitioning = false;

  function updateAvatar(sectionKey) {
    if (!visibleAvatar || !hiddenAvatar || activeSection === sectionKey || isTransitioning) {
      return;
    }

    const targetSrc = avatarMap[sectionKey] || avatarMap.default;
    if (visibleAvatar.getAttribute('src') === targetSrc) {
      activeSection = sectionKey;
      return;
    }

    isTransitioning = true;

    const loader = new Image();
    loader.onload = function () {
      hiddenAvatar.src = targetSrc;
      hiddenAvatar.classList.add('is-visible');
      visibleAvatar.classList.remove('is-visible');

      window.setTimeout(function () {
        const previousVisible = visibleAvatar;
        visibleAvatar = hiddenAvatar;
        hiddenAvatar = previousVisible;
        activeSection = sectionKey;
        isTransitioning = false;
      }, 450);
    };
    loader.src = targetSrc;
  }

  function closeAllAccordionItems() {
    accordionItems.forEach(function (otherItem) {
      const otherBody = otherItem.querySelector('.acc-body');
      const otherHeader = otherItem.querySelector('.acc-header');
      otherItem.classList.remove('open');
      if (otherBody) otherBody.style.maxHeight = null;
      if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
    });
  }

  function openAccordionItem(item) {
    const body = item.querySelector('.acc-body');
    const header = item.querySelector('.acc-header');
    const section = item.getAttribute('data-section');

    closeAllAccordionItems();

    item.classList.add('open');
    if (body) body.style.maxHeight = (body.scrollHeight + 30) + 'px';
    if (header) header.setAttribute('aria-expanded', 'true');
    updateAvatar(section);
  }

  accordionItems.forEach(function (item) {
    const header = item.querySelector('.acc-header');
    const body = item.querySelector('.acc-body');

    if (!header || !body) return;

    header.onclick = function (e) {
      if (e) e.stopPropagation();
      const isCurrentlyOpen = item.classList.contains('open');

      if (!isCurrentlyOpen) {
        openAccordionItem(item);
        return;
      }

      closeAllAccordionItems();
      updateAvatar('default');
    };
  });
});
