document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const heroContent = document.querySelector(".hero-content");
  const bgVideo = document.querySelector(".hero-video");
  const floatingNav = document.querySelector(".floating-nav");
  const trailerSection = document.querySelector("#trailer");
  const trailerButtons = document.querySelectorAll(".trailer-scroll-btn");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const faqItems = document.querySelectorAll(".faq-item");
  const track = document.getElementById("reviewsTrack");
  const prev = document.querySelector(".reviews-prev");
  const next = document.querySelector(".reviews-next");

  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;

    const attemptHeroPlay = () => {
      const playPromise = bgVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          hero?.classList.add("hero-video-fallback");
        });
      }
    };

    bgVideo.addEventListener("loadeddata", attemptHeroPlay, { once: true });
    bgVideo.addEventListener("error", () => {
      bgVideo.style.display = "none";
      hero?.classList.add("hero-video-fallback");
    });
  }

  const easeInOutCubic = (t) => (
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  );

  const smoothScrollTo = (targetY, duration = 1100) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  if (trailerButtons.length && trailerSection) {
    trailerButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const targetY = trailerSection.getBoundingClientRect().top + window.pageYOffset - 36;
        smoothScrollTo(targetY);
      });
    });
  }

  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  }

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((openItem) => {
        if (openItem === item) return;
        openItem.classList.remove("is-open", "active");
        const openButton = openItem.querySelector(".faq-question");
        const openAnswer = openItem.querySelector(".faq-answer");
        const openIcon = openItem.querySelector(".faq-icon");
        if (openButton) openButton.setAttribute("aria-expanded", "false");
        if (openAnswer) {
          openAnswer.style.maxHeight = "0px";
          openAnswer.style.opacity = "0";
          openAnswer.style.paddingTop = "0px";
          openAnswer.style.paddingBottom = "0px";
        }
        if (openIcon) openIcon.textContent = "+";
      });

      if (isOpen) {
        item.classList.remove("is-open", "active");
        button.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
        answer.style.opacity = "0";
        answer.style.paddingTop = "0px";
        answer.style.paddingBottom = "0px";
        if (icon) icon.textContent = "+";
      } else {
        item.classList.add("is-open", "active");
        button.setAttribute("aria-expanded", "true");
        answer.style.opacity = "1";
        answer.style.paddingTop = "0px";
        answer.style.paddingBottom = "18px";
        answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
        if (icon) icon.textContent = "−";
      }
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.is-open .faq-answer").forEach((answer) => {
      answer.style.maxHeight = `${answer.scrollHeight + 30}px`;
    });
  });

  const onScroll = () => {
    if (!floatingNav) return;
    if (window.scrollY > 220) {
      floatingNav.classList.add("is-visible");
      document.body.classList.add("nav-active");
    } else {
      floatingNav.classList.remove("is-visible");
      document.body.classList.remove("nav-active");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (hero && heroContent && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("mousemove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      heroContent.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    hero.addEventListener("mouseleave", () => {
      heroContent.style.transform = "translate3d(0, 0, 0)";
    });
  }

  if (track && prev && next) {
    const scrollAmount = () => Math.min(track.clientWidth * 0.85, 800);

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
    });

    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
      scrollStart = track.scrollLeft;
      isDragging = true;
    }, { passive: true });

    track.addEventListener("touchmove", (event) => {
      if (!isDragging) return;
      const dx = startX - event.touches[0].clientX;
      track.scrollLeft = scrollStart + dx;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      isDragging = false;
    });

    let autoAdvance = window.setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth - 4;
      const nextLeft = track.scrollLeft + scrollAmount();
      track.scrollTo({
        left: nextLeft >= maxScroll ? 0 : nextLeft,
        behavior: "smooth"
      });
    }, 4200);

    const stopAuto = () => window.clearInterval(autoAdvance);
    const startAuto = () => {
      window.clearInterval(autoAdvance);
      autoAdvance = window.setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth - 4;
        const nextLeft = track.scrollLeft + scrollAmount();
        track.scrollTo({
          left: nextLeft >= maxScroll ? 0 : nextLeft,
          behavior: "smooth"
        });
      }, 4200);
    };

    [track, prev, next].forEach((element) => {
      element.addEventListener("mouseenter", stopAuto);
      element.addEventListener("mouseleave", startAuto);
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const languageDocks = Array.from(document.querySelectorAll(".language-dock"));
  const languageOptions = Array.from(document.querySelectorAll(".language-option"));
  if (!languageDocks.length || !languageOptions.length) return;

  const translations = {"en": {"metaTitle": "Where Winds Meet - Open-World Wuxia Action Adventure Game", "metaDescription": "Enter the world of Where Winds Meet, an open-world wuxia action adventure where martial arts, exploration, and ancient legends collide. Watch the official video and install on Steam.", "watchTrailer": "Watch Trailer", "navDownload": "Download Free", "heroEyebrow": "Become a Legendary Sword Master", "heroText": "Master fluid martial arts, move like a legend, and carve your own path through a vast wuxia world inspired by ancient China.", "heroMicro": "Install free on Steam and enter the jianghu with the official game video playing above.", "trailerKicker": "Official Trailer", "trailerTitle": "Watch the official game video in full quality.", "featuresKicker": "Key features", "featuresTitle": "Why players click install", "feature1Title": "Weave your story", "feature1Body": "Uncover your origin, shape your reputation, and decide what kind of sword master you become. In this world, your choices can lead to honor, chaos, or something in between.", "feature2Title": "Explore a breathtaking world", "feature2Body": "Travel across cities, forests, caves, temples, and countless hidden corners of the jianghu. The world feels alive, reactive, and built for discovery.", "feature3Title": "Deep RPG mechanics", "feature3Body": "Build a fighting style around speed, timing, weapons, and mystical martial arts. Movement and combat are designed to feel elegant, fast, and cinematic.", "feature4Title": "Adventure your way", "feature4Body": "Play the story solo or jump in with friends when you want company on the road. Whether you explore, duel, or chase progression, the game gives you room to play your way.", "faqKicker": "Where Winds Meet FAQs", "faqTitle": "Everything you need to know before you play.", "faqQ1": "Can I play right now?", "faqA1": "Yes. Where Winds Meet is already available, and this landing page is built to send PC players straight to Steam for install.", "faqQ2": "What kind of game is it?", "faqA2": "It is an open-world wuxia action RPG with martial arts combat, exploration, story choices, and a strong cinematic fantasy feel.", "faqQ3": "Can I play solo or with friends?", "faqA3": "You can explore solo or team up with others. The game supports both single-player progression and co-op style play depending on the mode.", "faqQ4": "Why do players install it?", "faqA4": "Because the hook is strong: stylish movement, fantasy martial arts, a huge world to explore, and a free-to-play entry point that lowers friction.", "highlightsKicker": "Graphic Highlights", "highlightsTitle": "What makes players want to install", "highlightsCopy": "Fast, visual proof points built around the real fantasy of the game: scale, combat, freedom, and low-friction entry.", "chip1Label": "Distinct regions", "chip2Label": "Unique NPCs", "chip3Label": "Martial Mystic Arts", "chip4Value": "Cross-Play", "chip4Label": "Play across platforms", "card1Tag": "Open World", "card1Stars": "20+ Regions", "card1Title": "Explore the jianghu at real scale", "card1Body": "Ride from crowded cities to hidden wilderness, temples, caves, and routes packed with secrets.", "card2Tag": "Living World", "card2Stars": "10,000 NPCs", "card2Title": "A world that feels busy and alive", "card2Body": "Meet allies, rivals, witnesses, and strangers whose reactions can change the tone of your journey.", "card3Tag": "Combat Fantasy", "card3Stars": "40+ Arts", "card3Title": "Build a stylish martial arts identity", "card3Body": "Mix weapons, movement, and Mystic Arts to create a combat style that looks fast, cinematic, and personal.", "card4Tag": "Low Friction", "card4Stars": "Free to Play", "card4Title": "Easy to start, hard to forget", "card4Body": "Jump in on PC, keep your progress across supported platforms, and start without a paywall blocking first install.", "highlightsDownloadCopy": "Watch the video, feel the atmosphere, then install free on Steam.", "installFree": "Install Free on Steam", "finalKicker": "Ready to play?", "finalTitle": "Download free and forge your legend.", "finalCopy": "Watch the official video or jump straight to Steam and install on PC.", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "kr": {"metaTitle": "Where Winds Meet - 오픈월드 무협 액션 어드벤처 게임", "metaDescription": "무협, 탐험, 그리고 고대 전설이 만나는 오픈월드 액션 어드벤처 Where Winds Meet의 세계로 들어오세요. 공식 영상을 보고 Steam에서 설치하세요.", "watchTrailer": "트레일러 보기", "navDownload": "무료 다운로드", "heroEyebrow": "전설적인 검객이 되어라", "heroText": "유려한 무공을 익히고 전설처럼 움직이며, 고대 중국에서 영감을 받은 광대한 무협 세계에서 나만의 길을 개척하세요.", "heroMicro": "Steam에서 무료로 설치하고, 위에서 재생되는 공식 게임 영상과 함께 강호에 입문하세요.", "trailerKicker": "공식 트레일러", "trailerTitle": "공식 게임 영상을 원본 화질로 감상하세요.", "featuresKicker": "핵심 특징", "featuresTitle": "플레이어가 설치를 누르는 이유", "feature1Title": "당신만의 이야기를 짜내다", "feature1Body": "자신의 출신을 밝히고, 명성을 쌓고, 어떤 검객이 될지 결정하세요. 이 세계에서 당신의 선택은 명예와 혼돈, 혹은 그 사이의 길로 이어질 수 있습니다.", "feature2Title": "압도적인 세계를 탐험하다", "feature2Body": "도시, 숲, 동굴, 사원, 그리고 수많은 숨겨진 강호의 구석을 여행하세요. 이 세계는 살아 움직이며, 반응하고, 발견하도록 설계되었습니다.", "feature3Title": "깊이 있는 RPG 시스템", "feature3Body": "속도, 타이밍, 무기, 신비한 무공을 조합해 자신만의 전투 스타일을 만드세요. 움직임과 전투는 우아하고 빠르며 영화처럼 느껴지도록 설계되었습니다.", "feature4Title": "원하는 방식으로 모험하라", "feature4Body": "혼자서 스토리를 즐기거나, 길 위에서 동료가 필요할 때 친구들과 함께하세요. 탐험, 결투, 성장 중 무엇을 택하든 당신만의 방식으로 즐길 수 있습니다.", "faqKicker": "Where Winds Meet FAQ", "faqTitle": "플레이 전에 알아야 할 모든 것.", "faqQ1": "지금 바로 플레이할 수 있나요?", "faqA1": "네. Where Winds Meet는 이미 플레이 가능하며, 이 랜딩 페이지는 PC 플레이어를 Steam 설치 페이지로 바로 보내기 위해 만들어졌습니다.", "faqQ2": "어떤 종류의 게임인가요?", "faqA2": "무협 전투, 탐험, 스토리 선택, 그리고 강한 시네마틱 판타지 감성을 갖춘 오픈월드 무협 액션 RPG입니다.", "faqQ3": "혼자 또는 친구와 플레이할 수 있나요?", "faqA3": "혼자서 탐험할 수도 있고 다른 플레이어와 팀을 이룰 수도 있습니다. 모드에 따라 싱글 진행과 협동 플레이를 모두 지원합니다.", "faqQ4": "왜 사람들이 설치하나요?", "faqA4": "세련된 이동, 판타지 무공, 거대한 오픈월드, 그리고 무료 플레이 진입 장벽 덕분에 첫 설치가 매우 매력적이기 때문입니다.", "highlightsKicker": "그래픽 하이라이트", "highlightsTitle": "설치를 유도하는 핵심 포인트", "highlightsCopy": "게임의 진짜 판타지인 규모, 전투, 자유도, 낮은 진입 장벽을 시각적으로 빠르게 전달합니다.", "chip1Label": "개성 있는 지역", "chip2Label": "고유 NPC", "chip3Label": "무공 및 신공", "chip4Value": "크로스플레이", "chip4Label": "플랫폼 간 플레이", "card1Tag": "오픈월드", "card1Stars": "20개 이상 지역", "card1Title": "진짜 스케일의 강호를 탐험", "card1Body": "붐비는 도시부터 숨겨진 야생, 사원, 동굴, 비밀 루트까지 자유롭게 누비세요.", "card2Tag": "살아 있는 세계", "card2Stars": "10,000 NPC", "card2Title": "북적이고 살아 있는 세계", "card2Body": "동료, 라이벌, 목격자, 낯선 이들을 만나며 그들의 반응으로 여정의 분위기가 달라집니다.", "card3Tag": "전투 판타지", "card3Stars": "40개 이상 기술", "card3Title": "스타일리시한 무협 정체성 구축", "card3Body": "무기, 이동기, 신공을 조합해 빠르고 영화적이며 개성 있는 전투 스타일을 만드세요.", "card4Tag": "낮은 진입 장벽", "card4Stars": "무료 플레이", "card4Title": "시작은 쉽고, 여운은 깊게", "card4Body": "PC에서 바로 시작하고, 지원되는 플랫폼 사이에서 진행 상황을 이어가며, 첫 설치를 막는 결제 장벽 없이 뛰어드세요.", "highlightsDownloadCopy": "영상을 보고 분위기를 느낀 뒤 Steam에서 무료로 설치하세요.", "installFree": "Steam에서 무료 설치", "finalKicker": "플레이할 준비가 되셨나요?", "finalTitle": "무료로 다운로드하고 전설을 시작하세요.", "finalCopy": "공식 영상을 보거나 Steam에서 바로 PC에 설치하세요.", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "jp": {"metaTitle": "Where Winds Meet - オープンワールド武侠アクションアドベンチャー", "metaDescription": "武侠、探索、古代伝説が交わるオープンワールドアクションアドベンチャー『Where Winds Meet』の世界へ。公式映像を見て、Steamでインストール。", "watchTrailer": "トレーラーを見る", "navDownload": "無料ダウンロード", "heroEyebrow": "伝説の剣客となれ", "heroText": "流れるような武芸を極め、伝説のように駆け抜け、古代中国に着想を得た広大な武侠世界で自分だけの道を切り開こう。", "heroMicro": "Steamで無料インストールして、上で再生される公式ゲーム映像とともに江湖へ踏み出そう。", "trailerKicker": "公式トレーラー", "trailerTitle": "公式ゲーム映像を高画質でチェック。", "featuresKicker": "主な特徴", "featuresTitle": "プレイヤーがインストールを押す理由", "feature1Title": "自分だけの物語を紡ぐ", "feature1Body": "自らの出自を解き明かし、名声を築き、どんな剣客になるかを決めよう。この世界では選択が名誉にも混沌にも、その間の道にもつながる。", "feature2Title": "息を呑む世界を探索", "feature2Body": "都市、森、洞窟、寺院、そして無数の隠れた江湖の一角を旅しよう。世界は生きていて、反応し、発見のために作られている。", "feature3Title": "奥深いRPGシステム", "feature3Body": "速度、間合い、武器、神秘的な武芸を組み合わせ、自分だけの戦闘スタイルを作ろう。移動も戦闘も優雅で速く、映画のように感じられる。", "feature4Title": "自分の流儀で冒険", "feature4Body": "物語を一人で楽しむことも、仲間がほしい時に友達と旅することもできる。探索、決闘、成長、どの遊び方でも自由だ。", "faqKicker": "Where Winds Meet FAQ", "faqTitle": "プレイ前に知っておきたいこと。", "faqQ1": "今すぐ遊べますか？", "faqA1": "はい。Where Winds Meetはすでに配信中で、このランディングページはPCプレイヤーをSteamのインストール先へ直接送るために作られています。", "faqQ2": "どんなゲームですか？", "faqA2": "武芸バトル、探索、物語の選択、そしてシネマティックな幻想感を備えたオープンワールド武侠アクションRPGです。", "faqQ3": "ソロでも友達とも遊べますか？", "faqA3": "一人で探索することも、他のプレイヤーと組むこともできます。モードに応じてシングル進行と協力プレイの両方を楽しめます。", "faqQ4": "なぜインストールされるのですか？", "faqA4": "スタイリッシュな移動、幻想的な武芸、巨大な世界、そして無料で始められる低いハードルが強い魅力だからです。", "highlightsKicker": "グラフィックハイライト", "highlightsTitle": "インストールしたくなる理由", "highlightsCopy": "規模、戦闘、自由度、始めやすさというゲーム本来の魅力を、視覚的に素早く伝えます。", "chip1Label": "個性的な地域", "chip2Label": "ユニークなNPC", "chip3Label": "武芸と秘術", "chip4Value": "クロスプレイ", "chip4Label": "複数プラットフォーム対応", "card1Tag": "オープンワールド", "card1Stars": "20以上の地域", "card1Title": "本物のスケールで江湖を探索", "card1Body": "賑やかな街から秘境、寺院、洞窟、隠しルートまで、秘密に満ちた世界を駆け巡ろう。", "card2Tag": "生きた世界", "card2Stars": "10,000 NPC", "card2Title": "にぎやかで息づく世界", "card2Body": "仲間、ライバル、目撃者、見知らぬ人々との出会いが旅の空気を変えていく。", "card3Tag": "戦闘ファンタジー", "card3Stars": "40以上の技", "card3Title": "スタイリッシュな武侠スタイルを作る", "card3Body": "武器、身法、秘術を組み合わせ、速く、映画的で、自分らしい戦い方を築こう。", "card4Tag": "始めやすさ", "card4Stars": "基本プレイ無料", "card4Title": "始めやすく、忘れがたい", "card4Body": "PCですぐ始められ、対応プラットフォーム間で進行を引き継ぎ、最初のインストールを妨げる課金の壁なしで飛び込める。", "highlightsDownloadCopy": "映像で雰囲気を感じたら、Steamで無料インストール。", "installFree": "Steamで無料インストール", "finalKicker": "プレイする準備はできましたか？", "finalTitle": "無料でダウンロードして伝説を刻もう。", "finalCopy": "公式映像を見るか、SteamからPCへ直接インストールしましょう。", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "vn": {"metaTitle": "Where Winds Meet - Game hành động phiêu lưu võ hiệp thế giới mở", "metaDescription": "Bước vào thế giới Where Winds Meet, nơi võ thuật, khám phá và truyền thuyết cổ xưa hòa quyện trong một cuộc phiêu lưu thế giới mở. Xem video chính thức và cài đặt trên Steam.", "watchTrailer": "Xem trailer", "navDownload": "Tải miễn phí", "heroEyebrow": "Trở thành kiếm khách huyền thoại", "heroText": "Làm chủ võ học uyển chuyển, di chuyển như một huyền thoại và tự mở lối đi của bạn trong thế giới kiếm hiệp rộng lớn lấy cảm hứng từ Trung Hoa cổ đại.", "heroMicro": "Cài miễn phí trên Steam và bước vào giang hồ cùng video chính thức đang phát phía trên.", "trailerKicker": "Trailer chính thức", "trailerTitle": "Xem video chính thức của game với chất lượng đầy đủ.", "featuresKicker": "Tính năng nổi bật", "featuresTitle": "Vì sao người chơi nhấn cài đặt", "feature1Title": "Dệt nên câu chuyện của bạn", "feature1Body": "Khám phá thân thế, xây dựng danh vọng và quyết định bạn sẽ trở thành kiểu kiếm khách nào. Trong thế giới này, lựa chọn của bạn có thể dẫn đến vinh quang, hỗn loạn hoặc điều gì đó ở giữa.", "feature2Title": "Khám phá một thế giới ngoạn mục", "feature2Body": "Du hành qua thành phố, rừng sâu, hang động, đền đài và vô số góc khuất của giang hồ. Thế giới luôn sống động, phản hồi và được tạo ra để khám phá.", "feature3Title": "Cơ chế RPG chuyên sâu", "feature3Body": "Xây dựng phong cách chiến đấu từ tốc độ, thời điểm ra đòn, vũ khí và võ công huyền bí. Chuyển động và chiến đấu được thiết kế để vừa thanh thoát vừa điện ảnh.", "feature4Title": "Phiêu lưu theo cách của bạn", "feature4Body": "Chơi cốt truyện một mình hoặc đồng hành cùng bạn bè khi bạn muốn có người sát cánh. Dù khám phá, đấu tay đôi hay phát triển nhân vật, game đều cho bạn không gian tự do.", "faqKicker": "FAQ Where Winds Meet", "faqTitle": "Mọi điều bạn cần biết trước khi chơi.", "faqQ1": "Tôi có thể chơi ngay bây giờ không?", "faqA1": "Có. Where Winds Meet đã phát hành, và landing page này được tạo để đưa người chơi PC đến thẳng trang cài đặt trên Steam.", "faqQ2": "Đây là thể loại game gì?", "faqA2": "Đây là game hành động RPG võ hiệp thế giới mở với chiến đấu võ thuật, khám phá, lựa chọn cốt truyện và cảm giác giả tưởng điện ảnh rất rõ rệt.", "faqQ3": "Tôi có thể chơi solo hay với bạn bè?", "faqA3": "Bạn có thể khám phá một mình hoặc lập đội với người khác. Tùy chế độ, game hỗ trợ cả tiến trình chơi đơn lẫn phong cách co-op.", "faqQ4": "Vì sao người chơi cài game?", "faqA4": "Vì điểm hút rất mạnh: di chuyển đẹp mắt, võ học giả tưởng, một thế giới rộng lớn để khám phá và điểm vào miễn phí giúp giảm rào cản cài đặt.", "highlightsKicker": "Điểm nhấn đồ họa", "highlightsTitle": "Điều gì khiến người chơi muốn cài", "highlightsCopy": "Những điểm nhấn trực quan, nhanh gọn xoay quanh cảm giác cốt lõi của game: quy mô, chiến đấu, tự do và khả năng vào game dễ dàng.", "chip1Label": "Vùng đất riêng biệt", "chip2Label": "NPC độc nhất", "chip3Label": "Tuyệt kỹ võ học", "chip4Value": "Chơi chéo", "chip4Label": "Chơi trên nhiều nền tảng", "card1Tag": "Thế giới mở", "card1Stars": "20+ khu vực", "card1Title": "Khám phá giang hồ ở quy mô thật sự", "card1Body": "Phi ngựa từ thành thị đông đúc đến vùng hoang dã, đền đài, hang động và những lối đi đầy bí mật.", "card2Tag": "Thế giới sống", "card2Stars": "10.000 NPC", "card2Title": "Một thế giới náo nhiệt và sống động", "card2Body": "Gặp đồng minh, đối thủ, nhân chứng và người lạ, những người có thể thay đổi sắc thái của hành trình của bạn.", "card3Tag": "Chiến đấu giả tưởng", "card3Stars": "40+ kỹ nghệ", "card3Title": "Tạo bản sắc võ hiệp thật phong cách", "card3Body": "Kết hợp vũ khí, thân pháp và tuyệt kỹ thần bí để tạo nên lối chiến đấu nhanh, điện ảnh và đậm dấu ấn riêng.", "card4Tag": "Dễ tiếp cận", "card4Stars": "Miễn phí", "card4Title": "Dễ bắt đầu, khó quên", "card4Body": "Nhảy vào game trên PC, giữ tiến trình trên các nền tảng được hỗ trợ và bắt đầu mà không bị chặn bởi paywall ngay từ lần cài đầu tiên.", "highlightsDownloadCopy": "Xem video, cảm nhận bầu không khí rồi cài miễn phí trên Steam.", "installFree": "Cài miễn phí trên Steam", "finalKicker": "Sẵn sàng chơi chưa?", "finalTitle": "Tải miễn phí và viết nên huyền thoại của bạn.", "finalCopy": "Xem video chính thức hoặc vào thẳng Steam để cài đặt trên PC.", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "my": {"metaTitle": "Where Winds Meet - Permainan aksi pengembaraan wuxia dunia terbuka", "metaDescription": "Masuki dunia Where Winds Meet, pengembaraan aksi dunia terbuka yang menggabungkan seni bela diri, penerokaan, dan legenda purba. Tonton video rasmi dan pasang di Steam.", "watchTrailer": "Tonton trailer", "navDownload": "Muat turun percuma", "heroEyebrow": "Jadilah pendekar pedang legenda", "heroText": "Kuasai seni bela diri yang lancar, bergerak seperti legenda, dan ukir jalan anda sendiri dalam dunia wuxia luas yang diinspirasikan oleh China purba.", "heroMicro": "Pasang percuma di Steam dan melangkah ke jianghu bersama video rasmi permainan yang dimainkan di atas.", "trailerKicker": "Trailer rasmi", "trailerTitle": "Tonton video rasmi permainan dalam kualiti penuh.", "featuresKicker": "Ciri utama", "featuresTitle": "Mengapa pemain menekan install", "feature1Title": "Tenun kisah anda", "feature1Body": "Bongkar asal-usul anda, bentuk reputasi anda, dan tentukan jenis pendekar pedang yang anda mahu jadi. Di dunia ini, pilihan anda boleh membawa kepada kehormatan, huru-hara, atau sesuatu di antaranya.", "feature2Title": "Terokai dunia yang memukau", "feature2Body": "Merentas bandar, hutan, gua, kuil, dan pelbagai sudut tersembunyi jianghu. Dunia ini terasa hidup, responsif, dan dibina untuk diterokai.", "feature3Title": "Mekanik RPG yang mendalam", "feature3Body": "Bina gaya bertarung berdasarkan kelajuan, masa, senjata, dan seni bela diri mistik. Pergerakan dan pertarungan direka supaya terasa elegan, pantas, dan sinematik.", "feature4Title": "Bertualang mengikut cara anda", "feature4Body": "Mainkan cerita secara solo atau sertai rakan apabila anda mahukan teman di perjalanan. Sama ada meneroka, bertarung, atau mengejar kemajuan, permainan ini memberi ruang untuk gaya anda sendiri.", "faqKicker": "Soalan Lazim Where Winds Meet", "faqTitle": "Semua yang anda perlu tahu sebelum bermain.", "faqQ1": "Boleh saya bermain sekarang?", "faqA1": "Ya. Where Winds Meet sudah tersedia, dan landing page ini dibina untuk menghantar pemain PC terus ke Steam untuk pemasangan.", "faqQ2": "Apakah jenis permainan ini?", "faqA2": "Ia ialah RPG aksi wuxia dunia terbuka dengan pertempuran seni bela diri, penerokaan, pilihan cerita, dan rasa fantasi sinematik yang kuat.", "faqQ3": "Boleh main solo atau bersama rakan?", "faqA3": "Anda boleh meneroka secara solo atau bekerjasama dengan pemain lain. Bergantung pada mod, permainan ini menyokong kemajuan pemain tunggal serta gaya co-op.", "faqQ4": "Mengapa pemain memasangnya?", "faqA4": "Kerana tarikannya kuat: pergerakan bergaya, seni bela diri fantasi, dunia yang besar untuk diteroka, dan kemasukan percuma yang mengurangkan halangan pemasangan.", "highlightsKicker": "Sorotan visual", "highlightsTitle": "Apa yang membuatkan pemain mahu install", "highlightsCopy": "Bukti visual yang cepat dan jelas berasaskan fantasi sebenar permainan ini: skala, pertarungan, kebebasan, dan kemasukan yang mudah.", "chip1Label": "Wilayah berbeza", "chip2Label": "NPC unik", "chip3Label": "Seni mistik bela diri", "chip4Value": "Main silang", "chip4Label": "Main merentas platform", "card1Tag": "Dunia Terbuka", "card1Stars": "20+ wilayah", "card1Title": "Terokai jianghu pada skala sebenar", "card1Body": "Menunggang dari bandar yang sibuk ke kawasan liar tersembunyi, kuil, gua, dan laluan yang penuh rahsia.", "card2Tag": "Dunia Hidup", "card2Stars": "10,000 NPC", "card2Title": "Dunia yang sibuk dan hidup", "card2Body": "Temui sekutu, saingan, saksi, dan orang asing yang boleh mengubah suasana perjalanan anda.", "card3Tag": "Fantasi Pertarungan", "card3Stars": "40+ seni", "card3Title": "Bina identiti seni bela diri yang bergaya", "card3Body": "Gabungkan senjata, pergerakan, dan Mystic Arts untuk mencipta gaya bertarung yang pantas, sinematik, dan peribadi.", "card4Tag": "Halangan Rendah", "card4Stars": "Percuma untuk dimainkan", "card4Title": "Mudah bermula, sukar dilupakan", "card4Body": "Masuk di PC, simpan kemajuan anda merentas platform yang disokong, dan mulakan tanpa paywall yang menghalang pemasangan pertama.", "highlightsDownloadCopy": "Tonton video, rasai suasananya, kemudian pasang percuma di Steam.", "installFree": "Pasang percuma di Steam", "finalKicker": "Sedia untuk bermain?", "finalTitle": "Muat turun percuma dan tempa legenda anda.", "finalCopy": "Tonton video rasmi atau pergi terus ke Steam untuk pemasangan PC.", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "th": {"metaTitle": "Where Winds Meet - เกมแอ็กชันผจญภัยกำลังภายในโอเพนเวิลด์", "metaDescription": "เข้าสู่โลกของ Where Winds Meet เกมแอ็กชันผจญภัยโอเพนเวิลด์ที่รวมศิลปะการต่อสู้ การสำรวจ และตำนานโบราณไว้ด้วยกัน ชมวิดีโอทางการและติดตั้งบน Steam", "watchTrailer": "ดูตัวอย่าง", "navDownload": "ดาวน์โหลดฟรี", "heroEyebrow": "ก้าวสู่การเป็นจอมดาบในตำนาน", "heroText": "เชี่ยวชาญวิทยายุทธ์ที่ลื่นไหล เคลื่อนไหวดุจตำนาน และกำหนดเส้นทางของคุณเองในโลกจอมยุทธ์อันกว้างใหญ่ที่ได้แรงบันดาลใจจากจีนโบราณ", "heroMicro": "ติดตั้งฟรีบน Steam แล้วเข้าสู่ยุทธภพไปพร้อมกับวิดีโอเกมทางการที่กำลังเล่นอยู่ด้านบน", "trailerKicker": "ตัวอย่างทางการ", "trailerTitle": "ชมวิดีโอเกมทางการด้วยคุณภาพเต็มรูปแบบ", "featuresKicker": "จุดเด่นหลัก", "featuresTitle": "ทำไมผู้เล่นถึงกดติดตั้ง", "feature1Title": "ถักทอเรื่องราวของคุณเอง", "feature1Body": "ค้นหาต้นกำเนิด สร้างชื่อเสียง และตัดสินใจว่าคุณจะเป็นจอมดาบแบบใด ในโลกนี้ การเลือกของคุณอาจนำไปสู่เกียรติยศ ความวุ่นวาย หรือบางอย่างระหว่างนั้น", "feature2Title": "สำรวจโลกที่น่าตื่นตา", "feature2Body": "เดินทางผ่านเมือง ป่า ถ้ำ วิหาร และมุมลับนับไม่ถ้วนของยุทธภพ โลกนี้มีชีวิต ตอบสนอง และถูกสร้างมาเพื่อการค้นพบ", "feature3Title": "ระบบ RPG ที่ลึกซึ้ง", "feature3Body": "สร้างสไตล์การต่อสู้จากความเร็ว จังหวะ อาวุธ และวิทยายุทธ์ลึกลับ การเคลื่อนไหวและการต่อสู้ถูกออกแบบมาให้สง่างาม รวดเร็ว และเหมือนภาพยนตร์", "feature4Title": "ผจญภัยในแบบของคุณ", "feature4Body": "เล่นเนื้อเรื่องคนเดียว หรือเข้าร่วมกับเพื่อนเมื่อคุณอยากมีเพื่อนร่วมทาง ไม่ว่าจะสำรวจ ดวล หรือพัฒนาตัวละคร เกมนี้เปิดพื้นที่ให้เล่นในแบบของคุณ", "faqKicker": "คำถามที่พบบ่อยของ Where Winds Meet", "faqTitle": "ทุกสิ่งที่คุณควรรู้ก่อนเล่น", "faqQ1": "เล่นได้ตอนนี้เลยไหม?", "faqA1": "ได้เลย Where Winds Meet เปิดให้เล่นแล้ว และหน้าแลนดิ้งเพจนี้ถูกสร้างมาเพื่อส่งผู้เล่น PC ไปยัง Steam เพื่อติดตั้งโดยตรง", "faqQ2": "นี่เป็นเกมแนวไหน?", "faqA2": "นี่คือเกมแอ็กชัน RPG กำลังภายในแบบโอเพนเวิลด์ ที่มีการต่อสู้ด้วยศิลปะการต่อสู้ การสำรวจ ทางเลือกในเนื้อเรื่อง และอารมณ์แฟนตาซีแบบภาพยนตร์", "faqQ3": "เล่นคนเดียวหรือกับเพื่อนได้ไหม?", "faqA3": "คุณสามารถสำรวจคนเดียวหรือร่วมทีมกับผู้เล่นอื่นได้ ตามโหมดที่เลือก เกมรองรับทั้งความคืบหน้าแบบเล่นคนเดียวและรูปแบบ co-op", "faqQ4": "ทำไมผู้เล่นถึงติดตั้ง?", "faqA4": "เพราะจุดดึงดูดชัดเจนมาก ทั้งการเคลื่อนไหวที่เท่ วิทยายุทธ์แฟนตาซี โลกขนาดใหญ่ให้สำรวจ และการเริ่มเล่นฟรีที่ลดแรงเสียดทานในการติดตั้ง", "highlightsKicker": "ไฮไลต์แบบกราฟิก", "highlightsTitle": "อะไรทำให้ผู้เล่นอยากติดตั้ง", "highlightsCopy": "จุดขายแบบภาพที่สื่อแฟนตาซีหลักของเกมได้เร็วและชัด ทั้งขนาดโลก การต่อสู้ อิสระในการเล่น และการเริ่มต้นที่ง่าย", "chip1Label": "พื้นที่โดดเด่น", "chip2Label": "NPC เฉพาะตัว", "chip3Label": "วิชายุทธ์ลี้ลับ", "chip4Value": "เล่นข้ามแพลตฟอร์ม", "chip4Label": "เล่นได้หลายแพลตฟอร์ม", "card1Tag": "โอเพนเวิลด์", "card1Stars": "20+ พื้นที่", "card1Title": "สำรวจยุทธภพในสเกลที่แท้จริง", "card1Body": "เดินทางจากเมืองที่คึกคักไปยังป่าเงียบ วิหาร ถ้ำ และเส้นทางลับที่เต็มไปด้วยความลับ", "card2Tag": "โลกมีชีวิต", "card2Stars": "10,000 NPC", "card2Title": "โลกที่คึกคักและมีชีวิตชีวา", "card2Body": "พบพันธมิตร คู่แข่ง พยาน และคนแปลกหน้าที่สามารถเปลี่ยนอารมณ์ของการเดินทางคุณได้", "card3Tag": "แฟนตาซีการต่อสู้", "card3Stars": "40+ ศิลป์", "card3Title": "สร้างตัวตนจอมยุทธ์ที่มีสไตล์", "card3Body": "ผสมอาวุธ การเคลื่อนไหว และ Mystic Arts เพื่อสร้างสไตล์การต่อสู้ที่รวดเร็ว ภาพยนตร์ และเป็นตัวคุณ", "card4Tag": "เริ่มง่าย", "card4Stars": "เล่นฟรี", "card4Title": "เริ่มง่าย แต่ยากจะลืม", "card4Body": "เริ่มเล่นบน PC เก็บความคืบหน้าข้ามแพลตฟอร์มที่รองรับ และเข้าสู่เกมได้โดยไม่มี paywall มาขวางการติดตั้งครั้งแรก", "highlightsDownloadCopy": "ชมวิดีโอ สัมผัสบรรยากาศ แล้วติดตั้งฟรีบน Steam", "installFree": "ติดตั้งฟรีบน Steam", "finalKicker": "พร้อมเล่นหรือยัง?", "finalTitle": "ดาวน์โหลดฟรีและสร้างตำนานของคุณ", "finalCopy": "ชมวิดีโอทางการหรือเข้า Steam เพื่อติดตั้งบน PC ได้ทันที", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "zh": {"metaTitle": "Where Winds Meet - 開放世界武俠動作冒險遊戲", "metaDescription": "踏入《Where Winds Meet》的世界，在這款開放世界武俠動作冒險中體驗武學、探索與古老傳說的交會。觀看官方影片並在 Steam 安裝。", "watchTrailer": "觀看預告", "navDownload": "免費下載", "heroEyebrow": "成為傳奇劍客", "heroText": "精通行雲流水般的武學，像傳奇般穿梭江湖，並在靈感源自古代中國的廣闊武俠世界中走出屬於自己的道路。", "heroMicro": "在 Steam 免費安裝，搭配上方播放的官方遊戲影片，立即踏入江湖。", "trailerKicker": "官方預告", "trailerTitle": "以完整畫質觀看官方遊戲影片。", "featuresKicker": "核心特色", "featuresTitle": "玩家為何會按下安裝", "feature1Title": "編織你的故事", "feature1Body": "揭開你的身世、塑造你的名聲，並決定你將成為怎樣的劍客。在這個世界裡，你的選擇可能通往榮耀、混亂，或介於兩者之間的道路。", "feature2Title": "探索令人屏息的世界", "feature2Body": "穿越城市、森林、洞穴、寺廟，以及江湖中無數隱秘角落。這個世界充滿生命力、會做出回應，也為探索而生。", "feature3Title": "深度 RPG 機制", "feature3Body": "圍繞速度、時機、武器與神祕武學打造你的戰鬥風格。移動與戰鬥都被設計得優雅、迅速且極具電影感。", "feature4Title": "用你的方式冒險", "feature4Body": "可以獨自體驗劇情，也可以在旅途中與朋友同行。無論你想探索、決鬥或追求成長，遊戲都給你足夠的自由。", "faqKicker": "Where Winds Meet 常見問題", "faqTitle": "遊玩前你需要知道的一切。", "faqQ1": "現在就能玩嗎？", "faqA1": "可以。《Where Winds Meet》已經上線，而這個 Landing Page 的目的，就是把 PC 玩家直接送到 Steam 安裝。", "faqQ2": "這是什麼類型的遊戲？", "faqA2": "這是一款開放世界武俠動作 RPG，融合武學戰鬥、探索、劇情選擇，以及強烈的電影式奇幻氛圍。", "faqQ3": "可以單人或與朋友一起玩嗎？", "faqA3": "你可以單人探索，也可以與其他玩家組隊。視模式而定，遊戲同時支援單人進度與合作玩法。", "faqQ4": "為什麼玩家會安裝？", "faqA4": "因為它的吸引力非常直接：帥氣的移動、奇幻武學、龐大的探索世界，以及免費入門帶來的低安裝門檻。", "highlightsKicker": "視覺亮點", "highlightsTitle": "什麼讓玩家想立刻安裝", "highlightsCopy": "用快速而直觀的方式呈現遊戲真正的幻想核心：規模、戰鬥、自由度，以及低門檻上手。", "chip1Label": "特色地區", "chip2Label": "獨特 NPC", "chip3Label": "武學與秘術", "chip4Value": "跨平台遊玩", "chip4Label": "支援跨平台體驗", "card1Tag": "開放世界", "card1Stars": "20+ 地區", "card1Title": "以真正的規模探索江湖", "card1Body": "從熱鬧城市一路騎行到隱秘荒野、寺廟、洞穴與充滿秘密的路線。", "card2Tag": "鮮活世界", "card2Stars": "10,000 NPC", "card2Title": "熱鬧且充滿生命力的世界", "card2Body": "遇見盟友、對手、目擊者與陌生人，他們的反應都可能改變你旅程的氛圍。", "card3Tag": "戰鬥幻想", "card3Stars": "40+ 武藝", "card3Title": "打造屬於你的武俠風格", "card3Body": "結合武器、身法與 Mystic Arts，創造快速、電影感十足且帶有個人特色的戰鬥風格。", "card4Tag": "低摩擦入門", "card4Stars": "免費遊玩", "card4Title": "容易開始，難以忘記", "card4Body": "在 PC 立即展開旅程、保留支援平台間的進度，並在沒有付費牆阻擋首次安裝的情況下輕鬆入門。", "highlightsDownloadCopy": "先看影片、感受氛圍，然後在 Steam 免費安裝。", "installFree": "在 Steam 免費安裝", "finalKicker": "準備好開玩了嗎？", "finalTitle": "免費下載，鑄造你的傳奇。", "finalCopy": "觀看官方影片，或直接前往 Steam 安裝到 PC。", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "ru": {"metaTitle": "Where Winds Meet - экшен-приключение в жанре уся с открытым миром", "metaDescription": "Погрузитесь в мир Where Winds Meet — открытого уся-экшена, где боевые искусства, исследование и древние легенды сталкиваются воедино. Смотрите официальный ролик и устанавливайте в Steam.", "watchTrailer": "Смотреть трейлер", "navDownload": "Скачать бесплатно", "heroEyebrow": "Станьте легендарным мастером меча", "heroText": "Освойте плавные боевые искусства, двигайтесь как легенда и проложите собственный путь в огромном мире уся, вдохновленном древним Китаем.", "heroMicro": "Установите игру бесплатно в Steam и войдите в цзянху вместе с официальным роликом, который воспроизводится выше.", "trailerKicker": "Официальный трейлер", "trailerTitle": "Смотрите официальный ролик игры в полном качестве.", "featuresKicker": "Ключевые особенности", "featuresTitle": "Почему игроки нажимают установить", "feature1Title": "Сплетите свою историю", "feature1Body": "Раскройте свое происхождение, сформируйте репутацию и решите, каким мастером меча вы станете. В этом мире ваши выборы ведут к чести, хаосу или чему-то между ними.", "feature2Title": "Исследуйте захватывающий мир", "feature2Body": "Путешествуйте по городам, лесам, пещерам, храмам и бесчисленным скрытым уголкам цзянху. Мир живой, отзывчивый и создан для открытия.", "feature3Title": "Глубокие RPG-механики", "feature3Body": "Постройте свой стиль боя вокруг скорости, тайминга, оружия и мистических боевых искусств. Движение и бой ощущаются изящно, быстро и кинематографично.", "feature4Title": "Приключение по вашим правилам", "feature4Body": "Проходите сюжет в одиночку или отправляйтесь в путь с друзьями, когда вам нужна компания. Исследование, дуэли или развитие — игра дает свободу играть по-своему.", "faqKicker": "FAQ по Where Winds Meet", "faqTitle": "Все, что нужно знать перед игрой.", "faqQ1": "Можно играть уже сейчас?", "faqA1": "Да. Where Winds Meet уже доступна, а этот лендинг создан, чтобы сразу отправлять PC-игроков в Steam на установку.", "faqQ2": "Что это за игра?", "faqA2": "Это экшен-RPG в жанре уся с открытым миром, где есть боевые искусства, исследование, сюжетные выборы и яркая кинематографичная фэнтези-атмосфера.", "faqQ3": "Можно играть одному или с друзьями?", "faqA3": "Вы можете исследовать мир в одиночку или объединиться с другими игроками. В зависимости от режима игра поддерживает и одиночное прохождение, и кооперативный стиль.", "faqQ4": "Почему игроки устанавливают ее?", "faqA4": "Потому что крючок сильный: стильное передвижение, фантазийные боевые искусства, огромный мир для исследования и бесплатный вход без лишнего трения.", "highlightsKicker": "Графические акценты", "highlightsTitle": "Что заставляет игроков захотеть установить", "highlightsCopy": "Быстрые и наглядные аргументы, которые передают ключевую фантазию игры: масштаб, бой, свободу и легкий вход.", "chip1Label": "Уникальные регионы", "chip2Label": "Уникальные NPC", "chip3Label": "Боевые и мистические искусства", "chip4Value": "Кроссплей", "chip4Label": "Игра на разных платформах", "card1Tag": "Открытый мир", "card1Stars": "20+ регионов", "card1Title": "Исследуйте цзянху в настоящем масштабе", "card1Body": "Скачите из шумных городов в скрытую дикую природу, храмы, пещеры и маршруты, полные тайн.", "card2Tag": "Живой мир", "card2Stars": "10 000 NPC", "card2Title": "Мир, который дышит жизнью", "card2Body": "Встречайте союзников, соперников, свидетелей и незнакомцев, чьи реакции меняют настроение вашего путешествия.", "card3Tag": "Боевая фантазия", "card3Stars": "40+ искусств", "card3Title": "Создайте стильную боевую идентичность", "card3Body": "Сочетайте оружие, движение и Mystic Arts, чтобы построить быстрый, кинематографичный и по-настоящему ваш стиль боя.", "card4Tag": "Низкий барьер входа", "card4Stars": "Бесплатная игра", "card4Title": "Легко начать, трудно забыть", "card4Body": "Запускайте на PC, сохраняйте прогресс между поддерживаемыми платформами и начинайте без paywall, который мешает первой установке.", "highlightsDownloadCopy": "Посмотрите видео, почувствуйте атмосферу, а затем установите бесплатно в Steam.", "installFree": "Установить бесплатно в Steam", "finalKicker": "Готовы играть?", "finalTitle": "Скачайте бесплатно и создайте свою легенду.", "finalCopy": "Смотрите официальный ролик или сразу переходите в Steam для установки на PC.", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "mo": {"metaTitle": "Where Winds Meet - 開放世界武俠動作冒險遊戲", "metaDescription": "踏入《Where Winds Meet》的世界，在這款開放世界武俠動作冒險中體驗武學、探索與古老傳說的交會。觀看官方影片並在 Steam 安裝。", "watchTrailer": "觀看預告", "navDownload": "免費下載", "heroEyebrow": "成為傳奇劍客", "heroText": "精通行雲流水般的武學，像傳奇般穿梭江湖，並在靈感源自古代中國的廣闊武俠世界中走出屬於自己的道路。", "heroMicro": "在 Steam 免費安裝，搭配上方播放的官方遊戲影片，立即踏入江湖。", "trailerKicker": "官方預告", "trailerTitle": "以完整畫質觀看官方遊戲影片。", "featuresKicker": "核心特色", "featuresTitle": "玩家為何會按下安裝", "feature1Title": "編織你的故事", "feature1Body": "揭開你的身世、塑造你的名聲，並決定你將成為怎樣的劍客。在這個世界裡，你的選擇可能通往榮耀、混亂，或介於兩者之間的道路。", "feature2Title": "探索令人屏息的世界", "feature2Body": "穿越城市、森林、洞穴、寺廟，以及江湖中無數隱秘角落。這個世界充滿生命力、會做出回應，也為探索而生。", "feature3Title": "深度 RPG 機制", "feature3Body": "圍繞速度、時機、武器與神祕武學打造你的戰鬥風格。移動與戰鬥都被設計得優雅、迅速且極具電影感。", "feature4Title": "用你的方式冒險", "feature4Body": "可以獨自體驗劇情，也可以在旅途中與朋友同行。無論你想探索、決鬥或追求成長，遊戲都給你足夠的自由。", "faqKicker": "Where Winds Meet 常見問題", "faqTitle": "遊玩前你需要知道的一切。", "faqQ1": "現在就能玩嗎？", "faqA1": "可以。《Where Winds Meet》已經上線，而這個 Landing Page 的目的，就是把 PC 玩家直接送到 Steam 安裝。", "faqQ2": "這是什麼類型的遊戲？", "faqA2": "這是一款開放世界武俠動作 RPG，融合武學戰鬥、探索、劇情選擇，以及強烈的電影式奇幻氛圍。", "faqQ3": "可以單人或與朋友一起玩嗎？", "faqA3": "你可以單人探索，也可以與其他玩家組隊。視模式而定，遊戲同時支援單人進度與合作玩法。", "faqQ4": "為什麼玩家會安裝？", "faqA4": "因為它的吸引力非常直接：帥氣的移動、奇幻武學、龐大的探索世界，以及免費入門帶來的低安裝門檻。", "highlightsKicker": "視覺亮點", "highlightsTitle": "什麼讓玩家想立刻安裝", "highlightsCopy": "用快速而直觀的方式呈現遊戲真正的幻想核心：規模、戰鬥、自由度，以及低門檻上手。", "chip1Label": "特色地區", "chip2Label": "獨特 NPC", "chip3Label": "武學與秘術", "chip4Value": "跨平台遊玩", "chip4Label": "支援跨平台體驗", "card1Tag": "開放世界", "card1Stars": "20+ 地區", "card1Title": "以真正的規模探索江湖", "card1Body": "從熱鬧城市一路騎行到隱秘荒野、寺廟、洞穴與充滿秘密的路線。", "card2Tag": "鮮活世界", "card2Stars": "10,000 NPC", "card2Title": "熱鬧且充滿生命力的世界", "card2Body": "遇見盟友、對手、目擊者與陌生人，他們的反應都可能改變你旅程的氛圍。", "card3Tag": "戰鬥幻想", "card3Stars": "40+ 武藝", "card3Title": "打造屬於你的武俠風格", "card3Body": "結合武器、身法與 Mystic Arts，創造快速、電影感十足且帶有個人特色的戰鬥風格。", "card4Tag": "低摩擦入門", "card4Stars": "免費遊玩", "card4Title": "容易開始，難以忘記", "card4Body": "在 PC 立即展開旅程、保留支援平台間的進度，並在沒有付費牆阻擋首次安裝的情況下輕鬆入門。", "highlightsDownloadCopy": "先看影片、感受氛圍，然後在 Steam 免費安裝。", "installFree": "在 Steam 免費安裝", "finalKicker": "準備好開玩了嗎？", "finalTitle": "免費下載，鑄造你的傳奇。", "finalCopy": "觀看官方影片，或直接前往 Steam 安裝到 PC。", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "hk": {"metaTitle": "Where Winds Meet - 開放世界武俠動作冒險遊戲", "metaDescription": "踏入《Where Winds Meet》的世界，在這款開放世界武俠動作冒險中體驗武學、探索與古老傳說的交會。觀看官方影片並在 Steam 安裝。", "watchTrailer": "觀看預告", "navDownload": "免費下載", "heroEyebrow": "成為傳奇劍客", "heroText": "精通行雲流水般的武學，像傳奇般穿梭江湖，並在靈感源自古代中國的廣闊武俠世界中走出屬於自己的道路。", "heroMicro": "在 Steam 免費安裝，搭配上方播放的官方遊戲影片，立即踏入江湖。", "trailerKicker": "官方預告", "trailerTitle": "以完整畫質觀看官方遊戲影片。", "featuresKicker": "核心特色", "featuresTitle": "玩家為何會按下安裝", "feature1Title": "編織你的故事", "feature1Body": "揭開你的身世、塑造你的名聲，並決定你將成為怎樣的劍客。在這個世界裡，你的選擇可能通往榮耀、混亂，或介於兩者之間的道路。", "feature2Title": "探索令人屏息的世界", "feature2Body": "穿越城市、森林、洞穴、寺廟，以及江湖中無數隱秘角落。這個世界充滿生命力、會做出回應，也為探索而生。", "feature3Title": "深度 RPG 機制", "feature3Body": "圍繞速度、時機、武器與神祕武學打造你的戰鬥風格。移動與戰鬥都被設計得優雅、迅速且極具電影感。", "feature4Title": "用你的方式冒險", "feature4Body": "可以獨自體驗劇情，也可以在旅途中與朋友同行。無論你想探索、決鬥或追求成長，遊戲都給你足夠的自由。", "faqKicker": "Where Winds Meet 常見問題", "faqTitle": "遊玩前你需要知道的一切。", "faqQ1": "現在就能玩嗎？", "faqA1": "可以。《Where Winds Meet》已經上線，而這個 Landing Page 的目的，就是把 PC 玩家直接送到 Steam 安裝。", "faqQ2": "這是什麼類型的遊戲？", "faqA2": "這是一款開放世界武俠動作 RPG，融合武學戰鬥、探索、劇情選擇，以及強烈的電影式奇幻氛圍。", "faqQ3": "可以單人或與朋友一起玩嗎？", "faqA3": "你可以單人探索，也可以與其他玩家組隊。視模式而定，遊戲同時支援單人進度與合作玩法。", "faqQ4": "為什麼玩家會安裝？", "faqA4": "因為它的吸引力非常直接：帥氣的移動、奇幻武學、龐大的探索世界，以及免費入門帶來的低安裝門檻。", "highlightsKicker": "視覺亮點", "highlightsTitle": "什麼讓玩家想立刻安裝", "highlightsCopy": "用快速而直觀的方式呈現遊戲真正的幻想核心：規模、戰鬥、自由度，以及低門檻上手。", "chip1Label": "特色地區", "chip2Label": "獨特 NPC", "chip3Label": "武學與秘術", "chip4Value": "跨平台遊玩", "chip4Label": "支援跨平台體驗", "card1Tag": "開放世界", "card1Stars": "20+ 地區", "card1Title": "以真正的規模探索江湖", "card1Body": "從熱鬧城市一路騎行到隱秘荒野、寺廟、洞穴與充滿秘密的路線。", "card2Tag": "鮮活世界", "card2Stars": "10,000 NPC", "card2Title": "熱鬧且充滿生命力的世界", "card2Body": "遇見盟友、對手、目擊者與陌生人，他們的反應都可能改變你旅程的氛圍。", "card3Tag": "戰鬥幻想", "card3Stars": "40+ 武藝", "card3Title": "打造屬於你的武俠風格", "card3Body": "結合武器、身法與 Mystic Arts，創造快速、電影感十足且帶有個人特色的戰鬥風格。", "card4Tag": "低摩擦入門", "card4Stars": "免費遊玩", "card4Title": "容易開始，難以忘記", "card4Body": "在 PC 立即展開旅程、保留支援平台間的進度，並在沒有付費牆阻擋首次安裝的情況下輕鬆入門。", "highlightsDownloadCopy": "先看影片、感受氛圍，然後在 Steam 免費安裝。", "installFree": "在 Steam 免費安裝", "finalKicker": "準備好開玩了嗎？", "finalTitle": "免費下載，鑄造你的傳奇。", "finalCopy": "觀看官方影片，或直接前往 Steam 安裝到 PC。", "footerText": "Where Winds Meet © 2026. All rights reserved."}, "tw": {"metaTitle": "Where Winds Meet - 開放世界武俠動作冒險遊戲", "metaDescription": "踏入《Where Winds Meet》的世界，在這款開放世界武俠動作冒險中體驗武學、探索與古老傳說的交會。觀看官方影片並在 Steam 安裝。", "watchTrailer": "觀看預告", "navDownload": "免費下載", "heroEyebrow": "成為傳奇劍客", "heroText": "精通行雲流水般的武學，像傳奇般穿梭江湖，並在靈感源自古代中國的廣闊武俠世界中走出屬於自己的道路。", "heroMicro": "在 Steam 免費安裝，搭配上方播放的官方遊戲影片，立即踏入江湖。", "trailerKicker": "官方預告", "trailerTitle": "以完整畫質觀看官方遊戲影片。", "featuresKicker": "核心特色", "featuresTitle": "玩家為何會按下安裝", "feature1Title": "編織你的故事", "feature1Body": "揭開你的身世、塑造你的名聲，並決定你將成為怎樣的劍客。在這個世界裡，你的選擇可能通往榮耀、混亂，或介於兩者之間的道路。", "feature2Title": "探索令人屏息的世界", "feature2Body": "穿越城市、森林、洞穴、寺廟，以及江湖中無數隱秘角落。這個世界充滿生命力、會做出回應，也為探索而生。", "feature3Title": "深度 RPG 機制", "feature3Body": "圍繞速度、時機、武器與神祕武學打造你的戰鬥風格。移動與戰鬥都被設計得優雅、迅速且極具電影感。", "feature4Title": "用你的方式冒險", "feature4Body": "可以獨自體驗劇情，也可以在旅途中與朋友同行。無論你想探索、決鬥或追求成長，遊戲都給你足夠的自由。", "faqKicker": "Where Winds Meet 常見問題", "faqTitle": "遊玩前你需要知道的一切。", "faqQ1": "現在就能玩嗎？", "faqA1": "可以。《Where Winds Meet》已經上線，而這個 Landing Page 的目的，就是把 PC 玩家直接送到 Steam 安裝。", "faqQ2": "這是什麼類型的遊戲？", "faqA2": "這是一款開放世界武俠動作 RPG，融合武學戰鬥、探索、劇情選擇，以及強烈的電影式奇幻氛圍。", "faqQ3": "可以單人或與朋友一起玩嗎？", "faqA3": "你可以單人探索，也可以與其他玩家組隊。視模式而定，遊戲同時支援單人進度與合作玩法。", "faqQ4": "為什麼玩家會安裝？", "faqA4": "因為它的吸引力非常直接：帥氣的移動、奇幻武學、龐大的探索世界，以及免費入門帶來的低安裝門檻。", "highlightsKicker": "視覺亮點", "highlightsTitle": "什麼讓玩家想立刻安裝", "highlightsCopy": "用快速而直觀的方式呈現遊戲真正的幻想核心：規模、戰鬥、自由度，以及低門檻上手。", "chip1Label": "特色地區", "chip2Label": "獨特 NPC", "chip3Label": "武學與秘術", "chip4Value": "跨平台遊玩", "chip4Label": "支援跨平台體驗", "card1Tag": "開放世界", "card1Stars": "20+ 地區", "card1Title": "以真正的規模探索江湖", "card1Body": "從熱鬧城市一路騎行到隱秘荒野、寺廟、洞穴與充滿秘密的路線。", "card2Tag": "鮮活世界", "card2Stars": "10,000 NPC", "card2Title": "熱鬧且充滿生命力的世界", "card2Body": "遇見盟友、對手、目擊者與陌生人，他們的反應都可能改變你旅程的氛圍。", "card3Tag": "戰鬥幻想", "card3Stars": "40+ 武藝", "card3Title": "打造屬於你的武俠風格", "card3Body": "結合武器、身法與 Mystic Arts，創造快速、電影感十足且帶有個人特色的戰鬥風格。", "card4Tag": "低摩擦入門", "card4Stars": "免費遊玩", "card4Title": "容易開始，難以忘記", "card4Body": "在 PC 立即展開旅程、保留支援平台間的進度，並在沒有付費牆阻擋首次安裝的情況下輕鬆入門。", "highlightsDownloadCopy": "先看影片、感受氛圍，然後在 Steam 免費安裝。", "installFree": "在 Steam 免費安裝", "finalKicker": "準備好開玩了嗎？", "finalTitle": "免費下載，鑄造你的傳奇。", "finalCopy": "觀看官方影片，或直接前往 Steam 安裝到 PC。", "footerText": "Where Winds Meet © 2026. All rights reserved."}};
  const bindings = {"metaDescription": [{"selector": "meta[name=\"description\"]", "attr": "content"}, {"selector": "meta[property=\"og:description\"]", "attr": "content"}, {"selector": "meta[name=\"twitter:description\"]", "attr": "content"}], "watchTrailer": [{"selector": ".floating-nav-link"}, {"selector": ".hero .trailer-scroll-btn"}, {"selector": ".final-cta .trailer-scroll-btn"}], "navDownload": [{"selector": ".floating-nav-cta"}], "heroEyebrow": [{"selector": ".eyebrow"}], "heroText": [{"selector": ".hero-text"}], "heroMicro": [{"selector": ".hero-micro"}], "trailerKicker": [{"selector": "#trailer .section-kicker"}], "trailerTitle": [{"selector": "#trailer h2"}], "featuresKicker": [{"selector": ".gallery-kicker"}], "featuresTitle": [{"selector": "#ww-features-title"}], "feature1Title": [{"selector": ".features-grid .feature-card:nth-child(1) h4"}], "feature1Body": [{"selector": ".features-grid .feature-card:nth-child(1) p"}], "feature2Title": [{"selector": ".features-grid .feature-card:nth-child(2) h4"}], "feature2Body": [{"selector": ".features-grid .feature-card:nth-child(2) p"}], "feature3Title": [{"selector": ".features-grid .feature-card:nth-child(3) h4"}], "feature3Body": [{"selector": ".features-grid .feature-card:nth-child(3) p"}], "feature4Title": [{"selector": ".features-grid .feature-card:nth-child(4) h4"}], "feature4Body": [{"selector": ".features-grid .feature-card:nth-child(4) p"}], "faqKicker": [{"selector": ".faq-content .section-kicker"}], "faqTitle": [{"selector": ".faq-content h2"}], "faqQ1": [{"selector": ".faq-list .faq-item:nth-child(1) .faq-question span:first-child"}], "faqA1": [{"selector": ".faq-list .faq-item:nth-child(1) .faq-answer p"}], "faqQ2": [{"selector": ".faq-list .faq-item:nth-child(2) .faq-question span:first-child"}], "faqA2": [{"selector": ".faq-list .faq-item:nth-child(2) .faq-answer p"}], "faqQ3": [{"selector": ".faq-list .faq-item:nth-child(3) .faq-question span:first-child"}], "faqA3": [{"selector": ".faq-list .faq-item:nth-child(3) .faq-answer p"}], "faqQ4": [{"selector": ".faq-list .faq-item:nth-child(4) .faq-question span:first-child"}], "faqA4": [{"selector": ".faq-list .faq-item:nth-child(4) .faq-answer p"}], "highlightsKicker": [{"selector": ".reviews .section-kicker"}], "highlightsTitle": [{"selector": ".reviews h2"}], "highlightsCopy": [{"selector": ".reviews .section-intro .section-copy"}], "chip1Label": [{"selector": ".highlights-stat-strip .highlight-chip:nth-child(1) span"}], "chip2Label": [{"selector": ".highlights-stat-strip .highlight-chip:nth-child(2) span"}], "chip3Label": [{"selector": ".highlights-stat-strip .highlight-chip:nth-child(3) span"}], "chip4Value": [{"selector": ".highlights-stat-strip .highlight-chip:nth-child(4) strong"}], "chip4Label": [{"selector": ".highlights-stat-strip .highlight-chip:nth-child(4) span"}], "card1Tag": [{"selector": ".reviews-track .review-card:nth-child(1) .review-tag"}], "card1Stars": [{"selector": ".reviews-track .review-card:nth-child(1) .stars"}], "card1Title": [{"selector": ".reviews-track .review-card:nth-child(1) h3"}], "card1Body": [{"selector": ".reviews-track .review-card:nth-child(1) p"}], "card2Tag": [{"selector": ".reviews-track .review-card:nth-child(2) .review-tag"}], "card2Stars": [{"selector": ".reviews-track .review-card:nth-child(2) .stars"}], "card2Title": [{"selector": ".reviews-track .review-card:nth-child(2) h3"}], "card2Body": [{"selector": ".reviews-track .review-card:nth-child(2) p"}], "card3Tag": [{"selector": ".reviews-track .review-card:nth-child(3) .review-tag"}], "card3Stars": [{"selector": ".reviews-track .review-card:nth-child(3) .stars"}], "card3Title": [{"selector": ".reviews-track .review-card:nth-child(3) h3"}], "card3Body": [{"selector": ".reviews-track .review-card:nth-child(3) p"}], "card4Tag": [{"selector": ".reviews-track .review-card:nth-child(4) .review-tag"}], "card4Stars": [{"selector": ".reviews-track .review-card:nth-child(4) .stars"}], "card4Title": [{"selector": ".reviews-track .review-card:nth-child(4) h3"}], "card4Body": [{"selector": ".reviews-track .review-card:nth-child(4) p"}], "highlightsDownloadCopy": [{"selector": ".highlights-download-copy"}], "installFree": [{"selector": ".highlights-download-btn"}], "finalKicker": [{"selector": ".final-cta .section-kicker"}], "finalTitle": [{"selector": ".final-cta h2"}], "finalCopy": [{"selector": ".final-cta .section-copy"}], "footerText": [{"selector": ".site-footer small"}]};
  const htmlLangMap = {"en": "en", "kr": "ko", "jp": "ja", "vn": "vi", "my": "ms", "th": "th", "mo": "zh-Hant-MO", "hk": "zh-Hant-HK", "tw": "zh-Hant-TW", "zh": "zh-Hant", "ru": "ru"};

  const normalizeLang = (raw) => {
    const value = String(raw || "").trim().toLowerCase().replace("_", "-");
    if (!value) return "en";
    if (translations[value]) return value;
    if (value.startsWith("ko")) return "kr";
    if (value.startsWith("ja")) return "jp";
    if (value.startsWith("vi")) return "vn";
    if (value.startsWith("ms")) return "my";
    if (value.startsWith("th")) return "th";
    if (value.startsWith("ru")) return "ru";
    if (value.includes("zh") && value.includes("mo")) return "mo";
    if (value.includes("zh") && value.includes("hk")) return "hk";
    if (value.includes("zh") && value.includes("tw")) return "tw";
    if (value.startsWith("zh")) return "tw";
    return "en";
  };

  const setValue = (node, binding, value) => {
    if (!node) return;
    if (binding.attr) {
      node.setAttribute(binding.attr, value);
    } else {
      node.textContent = value;
    }
  };

  const applyTranslations = (lang) => {
    const locale = normalizeLang(lang);
    const t = translations[locale] || translations.en;

    document.title = t.metaTitle;
    document.documentElement.lang = htmlLangMap[locale] || "en";

    Object.entries(bindings).forEach(([key, bindingList]) => {
      const value = t[key];
      if (value == null) return;
      bindingList.forEach((binding) => {
        const node = document.querySelector(binding.selector);
        setValue(node, binding, value);
      });
    });

    document.querySelectorAll(".current-language-code").forEach((node) => {
      node.textContent = locale.toUpperCase();
    });
    languageOptions.forEach((option) => {
      const active = option.dataset.lang === locale;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const searchParams = new URLSearchParams(window.location.search);
  const queryLang = searchParams.get("lang");
  const savedLang = localStorage.getItem("wwmLang");
  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  const initialLang = normalizeLang(queryLang || savedLang || browserLang);

  applyTranslations(initialLang);

  const updateLang = (rawLang) => {
    const nextLang = normalizeLang(rawLang);
    localStorage.setItem("wwmLang", nextLang);
    applyTranslations(nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLang);
    window.history.replaceState({}, "", url.toString());
    languageDocks.forEach((dock) => {
      dock.classList.remove("open");
      const trigger = dock.querySelector(".language-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  };

  languageDocks.forEach((dock) => {
    const trigger = dock.querySelector(".language-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const willOpen = !dock.classList.contains("open");
      languageDocks.forEach((other) => {
        other.classList.remove("open");
        const otherTrigger = other.querySelector(".language-trigger");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });
      dock.classList.toggle("open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  languageOptions.forEach((option) => {
    option.addEventListener("click", () => updateLang(option.dataset.lang));
  });

  document.addEventListener("click", (event) => {
    languageDocks.forEach((dock) => {
      const trigger = dock.querySelector(".language-trigger");
      if (!dock.contains(event.target)) {
        dock.classList.remove("open");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      languageDocks.forEach((dock) => {
        dock.classList.remove("open");
        const trigger = dock.querySelector(".language-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });
});


/* --- Scroll reveal animation --- */
const revealElements=document.querySelectorAll('.reveal-on-scroll');

const revealObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.classList.add('visible');
  }
 });
},{threshold:.15});

revealElements.forEach(el=>revealObserver.observe(el));

/* --- simple multi language system --- */
const LANGS={
en:{download:'Download Free',trailer:'Watch Trailer'},
ru:{download:'Скачать бесплатно',trailer:'Смотреть трейлер'},
jp:{download:'無料ダウンロード',trailer:'トレーラーを見る'},
kr:{download:'무료 다운로드',trailer:'트레일러 보기'}
};

const langBtn=document.querySelector('.lang-btn');
const downloadBtn=document.querySelector('.download-btn');
const trailerBtn=document.querySelector('.watch-btn');

function setLang(l){
 if(!LANGS[l]) return;
 localStorage.setItem('lang',l);
 downloadBtn.innerText=LANGS[l].download;
 trailerBtn.innerText=LANGS[l].trailer;
}

let current=localStorage.getItem('lang')||navigator.language.slice(0,2);
if(LANGS[current]) setLang(current);
